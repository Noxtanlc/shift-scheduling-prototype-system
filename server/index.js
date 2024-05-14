"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// code that will make our backend server run
var express_1 = require("express");
var app = (0, express_1.default)(); // setting up our express server
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var mysql2_1 = require("mysql2");
var db = mysql2_1.default.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'shift-scheduler',
    dateStrings: true,
});
// code that will save ud errors in the future
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//
// let's us run our backend server. Message will output in our server terminal
app.listen(3001, function () {
    console.log("running on port 3001");
});
app.get("/api/get/shift-type", function (req, res) {
    var query = "SELECT * FROM `shift_type`";
    db.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            res.send(result);
        }
    });
});
app.get("/api/get/shift-table", function (req, res) {
    var query = "SELECT * FROM `shift`";
    db.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            res.send(result);
        }
    });
});
app.get("/api/get/shift-table/month=:month/year=:year", function (req, res) {
    var month = req.params.month;
    var year = req.params.year;
    var query = "SELECT `control_area`.ca_alias, " +
        "`shift_type`.st_name, `shift_type`.st_alias, `shift_type`.`color-coding`, " +
        "`staff_list`.first_name as fname, `staff_list`.last_name as lname, " +
        "`shift`.* FROM `shift` " +
        "INNER JOIN `staff_list` ON `staff_list`.staff_id = `shift`.FKstaffID " +
        "INNER JOIN `shift_type` ON `shift_type`.type_id = `shift`.shift_type_id " +
        "LEFT OUTER JOIN `control_area` ON `control_area`.ca_id = `shift`.controlarea_id " +
        "WHERE Month(start_date) = " + month + " AND Year(start_date) = " + year;
    db.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            res.send(result);
        }
    });
});
app.get("/api/get/staff", function (req, res) {
    var query = "SELECT * FROM `staff_list`";
    db.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            res.send(result);
        }
    });
});
app.get("/api/get/staff", function (req, res) {
    var query = "SELECT * FROM `staff_list`";
    db.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            res.send(result);
        }
    });
});
app.get("/api/get/group", function (req, res) {
    var query = "SELECT * FROM `group`";
    db.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            res.send(result);
        }
    });
});
app.get("/api/get/assigned_staff", function (req, res) {
    var query = "SELECT CONCAT(`slist`.first_name, ' ', `slist`.last_name) AS name, " +
        "`a_staff`.as_id as ID, `a_staff`.as_FKstaffID as staffID, `a_staff`.as_FKgroupID as groupID  FROM `shift-scheduler`.assigned_staff as `a_staff` " +
        "INNER JOIN `staff_list` as `slist` ON `slist`.staff_id = `a_staff`.as_FKstaffID";
    db.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            res.send(result);
        }
    });
});
app.post("/api/group/insert", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, gID, gName, selStaff, selNewGroup, checkDupeGroup, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body.value;
                gID = data['groupID'];
                gName = data['groupName'];
                selStaff = data['selectedStaff'];
                selNewGroup = "SELECT * FROM `group` WHERE groupName = ?";
                return [4 /*yield*/, db.query(selNewGroup, [gName])];
            case 1:
                checkDupeGroup = _a.sent();
                console.log(checkDupeGroup);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
