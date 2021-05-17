import oracledb from "oracledb";
import config from "../../config/index";

import express, { Router } from "express";
const router = express.Router();

oracledb.autoCommit = true;
// API 1. 생성
router.post("/", async (req, res) => {
  try {
    const {
      owner,
      address,
      floor,
      unit,
      roomsize,
      deposit,
      monthly,
      inputName,
    } = req.body;
    const conn = await oracledb.getConnection({
      user: config.USER,
      password: config.PASSWORD,
      connectString: config.CONNECTSTRING,
    });
    const query =
      "INSERT INTO HOUSEINFO(IDX_NUM,OWNER,ADDRESS,FLOOR,UNIT,ROOMSIZE,DEPOSIT,MONTHLY,INPUT_DATE,INPUT_EMP_NO)" +
      "VALUES(KM_TMP_IDX.NEXTVAL,:owner,:address,:floor,:unit,:roomsize,:deposit,:monthly,SYSDATE,:inputName)";
    const data = {
      owner,
      address,
      floor: Number(floor),
      unit: Number(unit),
      roomsize: Number(roomsize),
      deposit: Number(deposit),
      monthly: Number(monthly),
      inputName,
    };
    const result = await conn.execute(query, data);
    try {
      await conn.release();
    } catch (e) {
      console.error(e);
    }
    res.send({ successRow: result.rowsAffected });
  } catch (e) {
    console.log(e);
  }
});
// API 2. 수정
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {
      owner,
      address,
      floor,
      unit,
      roomsize,
      deposit,
      monthly,
      inputName,
    } = req.body;
    const conn = await oracledb.getConnection({
      user: config.USER,
      password: config.PASSWORD,
      connectString: config.CONNECTSTRING,
    });
    const query =
      "UPDATE HOUSEINFO SET OWNER = :owner, ADDRESS = :address, FLOOR = :floor, UNIT = :unit, " +
      "ROOMSIZE = :roomsize, DEPOSIT = :deposit, MONTHLY = :monthly, UPDATE_DATE = SYSDATE, UPDATE_EMP_NO = :inputName" +
      " WHERE IDX_NUM = :id";
    const data = {
      owner,
      address,
      floor: Number(floor),
      unit: Number(unit),
      roomsize: Number(roomsize),
      deposit: Number(deposit),
      monthly: Number(monthly),
      inputName,
      id: id,
    };
    const result = await conn.execute(query, data);
    try {
      await conn.release();
    } catch (e) {
      console.error(e);
    }
    res.send({ successRow: result.rowsAffected });
  } catch (e) {
    console.error(e);
  }
});
// API 3. 삭제
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const conn = await oracledb.getConnection({
      user: config.USER,
      password: config.PASSWORD,
      connectString: config.CONNECTSTRING,
    });
    const query = "DELETE HOUSEINFO WHERE IDX_NUM = :id";
    const data = {
      id: id,
    };
    const result = await conn.execute(query, data);
    try {
      await conn.release();
    } catch (e) {
      console.error(e);
    }
    res.send({ successRow: result.rowsAffected });
  } catch (e) {
    console.log(e);
  }
});
// API 4. 조회
router.get("/", async (req, res) => {
  try {
    const conn = await oracledb.getConnection({
      user: config.USER,
      password: config.PASSWORD,
      connectString: config.CONNECTSTRING,
    });
    let query = "SELECT * FROM HOUSEINFO";
    const result = await conn.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    try {
      conn.release();
    } catch (e) {
      console.error(e);
    }
    res.send(result.rows);
  } catch (e) {
    console.log(e);
  }
});
// API 5. 집계
router.get("/avg", async (req, res) => {
  try {
    const conn = await oracledb.getConnection({
      user: config.USER,
      password: config.PASSWORD,
      connectString: config.CONNECTSTRING,
    });

    let query = `SELECT ROUND(AVG(MONTHLY)) MONTHLY, ROUND(AVG(DEPOSIT)) DEPOSIT
                  FROM (SELECT MAX(MONTHLY) MONTHLY, MIN(DEPOSIT) DEPOSIT
                          FROM HOUSEINFO
                        WHERE (ADDRESS, FLOOR, UNIT, MONTHLY) IN
                              (SELECT ADDRESS, FLOOR, UNIT, MAX(MONTHLY)
                                  FROM HOUSEINFO
                                GROUP BY ADDRESS, FLOOR, UNIT)
                        GROUP BY ADDRESS, FLOOR, UNIT)`;

    const result = await conn.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    try {
      await conn.release();
    } catch (e) {
      console.error(e);
    }
    res.send(result.rows);
  } catch (e) {
    console.log(e);
  }
});
export default router;
