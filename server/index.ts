// code that will make our backend server run
import express from "express";
const app = express(); // setting up our express server
import bodyParser from "body-parser";
import cors from "cors";
import mysql, { RowDataPacket } from 'mysql2/promise';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import jwt from 'jsonwebtoken';
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc)
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.tz.setDefault('Asia/Kuala_Lumpuer');

const timezoneOffset = 8 * 60;

const port = process.env.PORT || 3001; // Change the port value if occupied

const config = {
    host: 'localhost', // Database hostname
    user: 'root', // Username to access the database
    password: 'root', // Password
    database: 'shift-scheduler', // Use database scheme
}


const db = mysql.createPool({
    connectionLimit: 20,
    ...config,
    dateStrings: true,
    multipleStatements: true,
});

// code that will save ud errors in the future

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
//

// let's us run our backend server. Message will output in our server terminal
app.listen(port, () => {
    console.log("running on port 3001");
})

let refreshTokens: any = [];

const generateAccessToken = (user: any) => {
    return jwt.sign({
        id: user.id,
        isAdmin: user.account_type,
    }, "loginKey", {
        expiresIn: "2hr",
    });
}

const generateRefreshToken = (user: any) => {
    return jwt.sign({
        id: user.id,
        isAdmin: user.account_type,
    }, "refreshKey");
}

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    const [result] = await db.query("SELECT * FROM `user` WHERE `username` = ? AND `password` = ?", [username, password]);
    const user: any = result;

    if (user.length > 0) {
        const accessToken = generateAccessToken(user[0]);
        const refreshToken = generateRefreshToken(user[0]);
        res.send({
            name: user[0].name,
            isAdmin: user[0].isAdmin,
            accessToken,
            refreshToken,
        })
    } else {
        res.status(401).send({
            response: "Username or password incorrect!"
        });
    }
});

app.post("/api/refresh", (req, res) => {
    const refreshToken: any = req.body.token;

    if (!refreshToken) return res.status(401).json("You are not authenticated!");

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid!");
    }

    jwt.verify(refreshToken, "refreshKey", (err: any, user: any) => {
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token: any) => token !== refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.push(newRefreshToken);

        res.status(200).json({
            acccessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    });
});

const verify = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, "loginKey", (err: any, user: any) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json("You are not authenticated!");
    }
};

app.post("/api/logout", verify, (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token: any) => token !== refreshToken);
    res.status(200).json("You logged out successfully.");
});

app.get("/api/shifts/", async (req, res) => {
    const query = "SELECT `control_area`.ca_alias, " +
        "`shift_category`.st_name, `shift_category`.st_alias, `shift_category`.`color-coding`, " +
        "`shift`.* FROM `shift` " +
        "INNER JOIN `shift_category` ON `shift_category`.id = `shift`.st_id " +
        "LEFT OUTER JOIN `control_area` ON `control_area`.ca_id = `shift`.ca_id ";
    await db.query(query).then((result) => { return res.send(result[0]) })
        .catch(err => console.log(err));
});

app.post("/api/shifts/staff/:id", async (req, res) => {
    const data = req.body.data;
    const action = req.body.action;
    const staff_id = req.params.id;
    const id = data['id'];
    const start_date = data['start_date'];
    const end_date = data['end_date'];
    const st_id = data['st_id'] === '0' ? null : data['st_id'];
    const ca_id = data['ca_id'] === '0' ? null : data['ca_id'];
    var check: boolean = false;

    switch (action) {
        case 'add': {
            const query = 'SELECT * FROM `shift` WHERE FKstaffID = ?';
            const [rows] = await db.query<RowDataPacket[]>(query, [staff_id]);
            rows.forEach((ele) => {
                const query_sdate = dayjs(new Date(ele.start_date));
                const query_edate = dayjs(new Date(ele.end_date));
                const sdate = dayjs(new Date(start_date));
                const edate = dayjs(new Date(end_date));

                if (sdate.isSame(query_sdate) || sdate.isSame(query_edate) || (edate.isSame(query_edate) || edate.isSame(query_sdate))) {
                    check = true;
                    return;
                };

                if (sdate.isBetween(query_sdate, query_edate) || edate.isBetween(query_sdate, query_edate)
                ) {
                    check = true;
                    return;
                }

                if (edate.isSameOrAfter(query_edate) && sdate.isSameOrBefore(query_sdate)) {
                    check = true;
                    return;
                };
            });

            if (!check) {
                const query = 'INSERT INTO `shift` (`FKstaffID`, `start_date`, `end_date`, `st_id`, `ca_id`) VALUES (?, ?, ?, ?, ?)';
                await db.query(query, [staff_id, start_date, end_date, st_id, ca_id])
                    .then((result) => {
                        res.send({
                            action: action,
                            title: 'Success'
                        })
                    })
                    .catch((err) => {
                        res.send({
                            err: err,
                            action: action,
                            title: 'Failed'
                        })
                    });
            } else {
                res.send({
                    response: 'There is a conflicting shift between the date. Pick another start/end date.',
                    action: action,
                    title: 'Failed'
                })
            }
            break;
        }

        case 'edit': {
            const query = 'SELECT * FROM `shift` WHERE FKstaffID = ? AND id != ?';
            const [rows] = await db.query<RowDataPacket[]>(query, [staff_id, id]);
            rows.forEach((ele) => {
                const query_sdate = dayjs(new Date(ele.start_date));
                const query_edate = dayjs(new Date(ele.end_date));
                const sdate = dayjs(new Date(start_date));
                const edate = dayjs(new Date(end_date));

                if (sdate.isSame(query_sdate) || sdate.isSame(query_edate) || (edate.isSame(query_edate) || edate.isSame(query_sdate))) {
                    check = true;
                    return;
                };

                if (sdate.isBetween(query_sdate, query_edate) || edate.isBetween(query_sdate, query_edate)
                ) {
                    check = true;
                    return;
                }

                if (edate.isSameOrAfter(query_edate) && sdate.isSameOrBefore(query_sdate)) {
                    check = true;
                    return;
                };
            });

            if (!check) {
                const update = "UPDATE `shift` SET st_id = ?, ca_id = ?, start_date = ?, end_date = ? WHERE id = ?"
                await db.query(update, [st_id, ca_id, start_date, end_date, id])
                    .then((result) => {
                        res.send({
                            action: action,
                            title: 'Success'
                        })
                    })
                    .catch((err) => {
                        res.send({
                            err: err,
                            action: action,
                            title: 'Failed'
                        })
                    });
            } else {
                res.send({
                    response: 'There is a conflicting shift between the date. Pick another start/end date.',
                    action: action,
                    title: 'Failed'
                })
            }
            break;
        }

        case 'delete': {
            const query = 'DELETE FROM `shift` WHERE id = ?';
            await db.query(query, id)
                .then(() => {
                    res.send({
                        action: action,
                        title: 'Success',
                    })
                }).catch(() => {
                    res.send({
                        action: action,
                        title: "Failed",
                    });
                });
            break;
        }

        default: break;
    }

});

app.post("/api/shifts/import", async (req, res) => {
    const data = req.body.data;
    const month = req.body.month;
    const year = req.body.year;
    const date = year + '-' + month + '-' + 1;
    const days = dayjs(date).daysInMonth();
    const insert = "INSERT INTO `shift` (`FKstaffID`, `start_date`, `end_date`, `st_id`, `ca_id`) VALUES (?, ?, ?, ?, null)";
    const shiftCategory = (await db.query<RowDataPacket[]>("SELECT * FROM `shift_category`"))[0];
    var update = false;

    for (const ele of data) {
        let empty = true;
        for (let i = 1; i <= days; i++) {
            if (ele[i] !== '') {
                empty = false;
                break;
            }
        }

        if (!empty) {
            if (!update) {
                await db.query("DELETE FROM `shift` WHERE YEAR(`start_date`) = ? AND MONTH(`start_date`) = ? AND `FKstaffID` = ?", [year, month, ele.ID])
                    .catch((err) => console.log(err));
            }

            for (let i = 1; i <= days; i++) {
                const date = year + '-' + month + '-' + i;
                if (ele[i] !== '') {
                    const shiftCategoryVal = shiftCategory.filter((val) => val.st_alias.toLowerCase() === ele[i].toLowerCase() || ele[i] === val['id'].toString());
                    await db.query(insert, [ele.ID, date, date, shiftCategoryVal[0]['id']]).then(() => update = true).catch(() => update = false);
                }
            }
        }
    }

    if (update) {
        res.send({
            response: 'Shifts have been updated!',
            title: 'Success'
        });
    } else {
        res.send({
            response: 'No changes are made or ran into a problem...',
            title: 'Failed'
        });
    }
});

app.get("/api/staff/", async (req, res) => {
    const query = "SELECT `staff_id`, CONCAT(`first_name`, ' ', `last_name`) AS name FROM `staff_list`";
    await db.query(query).then((result) => { return res.send(result[0]) })
        .catch(err => console.log(err));
});

app.get("/api/as_staff/", (req, res) => {
    const query = "SELECT CONCAT(`slist`.first_name, ' ', `slist`.last_name) AS name, " +
        "`a_staff`.as_id as ID, `a_staff`.as_FKstaffID as staffID, `a_staff`.as_FKgroupID as groupID  FROM `shift-scheduler`.assigned_staff as `a_staff` " +
        "INNER JOIN `staff_list` as `slist` ON `slist`.staff_id = `a_staff`.as_FKstaffID";
    db.query(query).then((result) => { return res.send(result[0]) })
        .catch(err => console.log(err));
});

app.get("/api/group/", async (req, res) => {
    const query = "SELECT * FROM `group` ORDER BY groupID";
    await db.query(query)
        .then((result) => {
            return res.send(result[0])
        })
        .catch(err => console.log(err));
});

app.post("/api/group/:id", async (req, res) => {
    const action = req.body.action;
    const id = req.params.id;
    const data = req.body.data;
    const gName = data['groupName'];
    let existGroup: boolean = false;

    switch (action) {
        case 'Add': {
            const selStaff = data['selectedStaff'];
            const selNewGroup = "SELECT * FROM `group` WHERE LOWER(`groupName`) = ?";
            const insertOption = "INSERT INTO `group` (`groupName`) VALUES (?)"
            const as_Insert = "INSERT INTO `assigned_staff` (`as_FKstaffID`, `as_FKgroupID`) VALUES (?, ?)"

            await db.query<RowDataPacket[]>(selNewGroup, [gName])
                .then((res: any) => {
                    if (res[0].length > 0)
                        existGroup = true;
                    else
                        existGroup = false;
                }).catch((err: any) => {
                    console.log(err);
                });

            if (!existGroup) {
                await db.query(insertOption, [gName])
                    .then((res) => {
                        console.log(res);
                    }).catch(err => {
                        console.log(err)
                    });

                const newGroupID: any = await db.query<RowDataPacket[]>(selNewGroup, [gName])
                    .then((res: any) => {
                        return res[0][0].groupID;
                    }).catch((err: any) => {
                        console.log(err);
                    });

                selStaff.forEach((element: any) => {
                    db.query(as_Insert, [+element, newGroupID]).then(res => {
                        console.log(res)
                    }).catch(err => {
                        console.log(err);
                    })
                });
                res.send({
                    message: "Group has been updated!",
                    title: "Success"
                });
            } else {
                res.send({
                    message: "There are groups with similar names! Try a different name!",
                    title: "Failed"
                });
            }
            break;
        }

        case 'Edit': {
            const check = "SELECT * FROM `group` WHERE LOWER(groupName) = ? AND `groupID` != ?";
            const Update = "UPDATE `group` SET groupName = ? WHERE groupID = ?";
            const as_Insert = "INSERT INTO `assigned_staff` (`as_FKstaffID`, `as_FKgroupID`) VALUES (?, ?)";
            const as_Delete = "DELETE FROM `assigned_staff` WHERE as_FKstaffID = ?";
            await db.query<RowDataPacket[]>(check, [gName, id])
                .then((res: any) => {
                    if (res[0].length > 0)
                        existGroup = true;
                    else
                        existGroup = false;
                }).catch((err: any) => {
                    console.log(err);
                });

            if (!existGroup) {
                const selStaff = data['selectedStaff'].map((ele: any) => {
                    return parseInt(ele);
                });
                const originalSelectVal = data['originalSelectedStaff'].map((ele: any) => {
                    return parseInt(ele);
                });
                const deletedVal = originalSelectVal.filter((ele: any) => {
                    return selStaff.indexOf(ele) < 0;
                });
                const selectedVal = selStaff.filter((ele: any) => {
                    return originalSelectVal.indexOf(ele) < 0;
                });

                // Update Group Name
                await Promise.all([
                    deletedVal.forEach((ele: any) => {
                        db.query(as_Delete, [ele])
                    }),

                    selectedVal.forEach((ele: any) => {
                        db.query(as_Insert, [ele, id])
                    }),

                    db.query(Update, [gName, id])
                        .then((res: any) => {
                            return res;
                        }).catch((err: any) => {
                            console.log(err);
                        }),
                ]).then(() => {
                    res.send({
                        message: 'Group successfully updated!',
                        title: 'Success',
                    })
                }).catch((err) => {
                    console.log(res);
                })
            } else {
                res.send({
                    message: "There are groups with similar names! Try a different name!",
                    title: "Failed"
                });
            }
            break;
        }

        case 'Delete': {
            const Delete = "DELETE FROM `group` WHERE groupID = ?";
            await db.query(Delete, id)
                .then(() => {
                    res.send({
                        message: 'Group ' + data.groupName + ' successfully deleted!',
                        title: 'Success',
                    })
                }).catch(() => {
                    res.send({
                        message: "There seems to be a problem deleting the group! Try again or refresh the page.",
                        title: "Failed",
                    });
                });
            break;
        }
        default: break;
    }
});

app.get("/api/location", async (_req, res) => {
    await db.query("SELECT * FROM `control_area`")
        .then((result) => {
            return res.send(result[0])
        }).catch(err => {
            console.log(err);
        });
})

app.post("/api/location/:id", async (req, res) => {
    const action = req.body.action;
    const data = req.body.data;
    const id = req.params.id;
    const ca_alias = data['ca_name'];
    const ca_desc = data['ca_desc']
    let exist: boolean = false;
    const checkAlias = "SELECT * FROM `control_area` WHERE LOWER(ca_alias) = ?";

    switch (action) {
        case 'Add': {
            const insertOption = "INSERT INTO `control_area` (ca_alias, ca_desc) VALUES (?, ?)"
            await db.query<RowDataPacket[]>(checkAlias, [ca_alias.toLowerCase()])
                .then((res: any) => {
                    if (res[0].length > 0)
                        exist = true;
                    else
                        exist = false;
                }).catch((err: any) => {
                    console.log(err);
                });

            if (!exist) {
                await db.query(insertOption, [ca_alias, ca_desc])
                    .then(() => {
                        return res.send({
                            response: ca_alias,
                            title: "Success"
                        })
                    }).catch(err => {
                        console.log(err)
                    })
            } else {
                res.send({
                    response: ca_alias,
                    title: "Failed"
                });
            }
            break;
        }
        case 'Edit': {
            const check = "SELECT * FROM `control_area` WHERE ca_alias = ? AND ca_id != ?"
            const update = "UPDATE `control_area` SET ca_alias = ?, ca_desc = ? WHERE ca_id = ?";
            await db.query(check, [ca_alias, id])
                .then((res: any) => {
                    if (res[0].length > 0)
                        exist = true;
                    else
                        exist = false;
                }).catch((err: any) => {
                    console.log(err);
                })

            if (!exist) {
                // Update Location
                await Promise.all([
                    db.query(update, [ca_alias, ca_desc, id])
                ]).then(() => {
                    res.send({
                        title: 'Success',
                    })
                }).catch((err) => {
                    console.log(res);
                })
            } else {
                res.send({
                    response: ca_alias,
                    title: "Failed"
                });
            }
            break;
        }
        case 'Delete': {
            const Delete = "DELETE FROM `control_area` WHERE ca_id = ?";

            await db.query(Delete, id)
                .then(() => {
                    res.send({
                        message: data.ca_alias,
                        title: 'Success',
                    })
                }).catch(() => {
                    res.send({
                        title: "Failed",
                    });
                });
            break;
        }
    }
});

app.get("/api/shift-category", async (req, res) => {
    const query = "SELECT * FROM `shift_category`";
    await db.query(query).then((result) => { return res.send(result[0]) })
        .catch(err => console.log(err));
});

app.post("/api/shift-category/:id", async (req, res) => {
    const data = req.body.data;
    const id = req.params.id;
    const action = req.body.action;
    const name = data['name'];
    const alias = data['alias'];
    const color = data['color'];
    const sTime = data['start_time'];
    const eTime = data['end_time'];
    const active = data['active'] ? 1 : 0;
    let dupe = false;
    const checkQuery = "SELECT * FROM `shift_category` WHERE LOWER(`st_name`) = ?";

    switch (action) {
        case 'Add': {
            const Insert = "INSERT INTO `shift_category` (`st_name`, `st_alias`, `color-coding`, `start_time`, `end_time`, `active`) VALUES (?, ?, ?, ?, ?, ?)"
            await db.query<RowDataPacket[]>(checkQuery, [name.toLowerCase()])
                .then((res: any) => {
                    if (res[0].length > 0)
                        dupe = true;
                    else
                        dupe = false;
                }).catch((err: any) => {
                    console.log(err);
                });

            if (!dupe) {
                await db.query(Insert, [name, alias, color, sTime, eTime, active])
                    .then(() => {
                        res.send({
                            response: name,
                            title: "Success"
                        })
                    }).catch(err => {
                        console.log(err)
                    })
            } else {
                res.send({
                    response: name,
                    title: "Failed"
                });
            }
            break;
        }
        case 'Edit': {
            const check = checkQuery + ' AND id != ?';
            const update = "UPDATE `shift_category` SET `st_name` = ?, `st_alias` = ?, `color-coding` = ?, `start_time` = ?, `end_time` = ?, `active` = ? WHERE `id` = ?";
            await db.query(check, [name.toLowerCase(), id])
                .then((res: any) => {
                    if (res[0].length > 0)
                        dupe = true;
                    else
                        dupe = false;
                }).catch((err: any) => {
                    console.log(err);
                })

            if (!dupe) {
                // Update Shift Template Name
                db.query(update, [name, alias, color, sTime, eTime, active, id])
                    .then((result) => {
                        res.send({
                            response: name,
                            title: 'Success',
                        })
                    }).catch((err) => {
                        console.log(res);
                    })
            } else {
                res.send({
                    response: name,
                    title: "Failed"
                });
            }
            break;
        }
        case 'Delete': {
            const Delete = "DELETE FROM `shift_category` WHERE id = ?";
            await db.query(Delete, id)
                .then(() => {
                    res.send({
                        message: data.name,
                        title: 'Success',
                    })
                }).catch(() => {
                    res.send({
                        title: "Failed",
                    });
                });
            break;
        }
        default: {
            break;
        }
    }
});
function aysnc() {
    throw new Error("Function not implemented.");
}

