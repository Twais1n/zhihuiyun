/*
 Navicat Premium Dump SQL

 Source Server         : Bos
 Source Server Type    : Oracle
 Source Server Version : 110200 (Oracle Database 11g Enterprise Edition Release 11.2.0.1.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options)
 Source Host           : 10.14.10.83:8853
 Source Schema         : BOSNDS3

 Target Server Type    : Oracle
 Target Server Version : 110200 (Oracle Database 11g Enterprise Edition Release 11.2.0.1.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options)
 File Encoding         : 65001

 Date: 15/11/2025 22:08:22
*/


-- ----------------------------
-- Table structure for HR_EMPLOYEE_STORE
-- ----------------------------
DROP TABLE "BOSNDS3"."HR_EMPLOYEE_STORE";
CREATE TABLE "BOSNDS3"."HR_EMPLOYEE_STORE" (
  "ID" NUMBER(10,0) NOT NULL,
  "AD_CLIENT_ID" NUMBER(10,0),
  "AD_ORG_ID" NUMBER(10,0),
  "HR_EMPLOYEE_ID" NUMBER(10,0),
  "C_STORE_ID" NUMBER(10,0),
  "OWNERID" NUMBER(10,0),
  "CREATIONDATE" DATE,
  "MODIFIERID" NUMBER(10,0),
  "MODIFIEDDATE" DATE,
  "ISACTIVE" CHAR(1 BYTE) DEFAULT 'Y' NOT NULL
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;

-- ----------------------------
-- Primary Key structure for table HR_EMPLOYEE_STORE
-- ----------------------------
ALTER TABLE "BOSNDS3"."HR_EMPLOYEE_STORE" ADD CONSTRAINT "SYS_C0027325" PRIMARY KEY ("ID");

-- ----------------------------
-- Checks structure for table HR_EMPLOYEE_STORE
-- ----------------------------
ALTER TABLE "BOSNDS3"."HR_EMPLOYEE_STORE" ADD CONSTRAINT "SYS_C0021827" CHECK ("ID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BOSNDS3"."HR_EMPLOYEE_STORE" ADD CONSTRAINT "SYS_C0021828" CHECK ("ISACTIVE" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- ----------------------------
-- Foreign Keys structure for table HR_EMPLOYEE_STORE
-- ----------------------------
ALTER TABLE "BOSNDS3"."HR_EMPLOYEE_STORE" ADD CONSTRAINT "FK_HR_EMPLOYEE_STORE_138595" FOREIGN KEY ("C_STORE_ID") REFERENCES "BOSNDS3"."C_STORE" ("ID") NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BOSNDS3"."HR_EMPLOYEE_STORE" ADD CONSTRAINT "FK_HR_EMPLOYEE_STORE_138596" FOREIGN KEY ("HR_EMPLOYEE_ID") REFERENCES "BOSNDS3"."HR_EMPLOYEE" ("ID") ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
