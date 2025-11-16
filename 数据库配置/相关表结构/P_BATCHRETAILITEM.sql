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

 Date: 16/11/2025 18:02:43
*/


-- ----------------------------
-- Table structure for P_BATCHRETAILITEM
-- ----------------------------
DROP TABLE "BOSNDS3"."P_BATCHRETAILITEM";
CREATE TABLE "BOSNDS3"."P_BATCHRETAILITEM" (
  "ID" NUMBER(10,0) NOT NULL,
  "AD_CLIENT_ID" NUMBER(10,0),
  "AD_ORG_ID" NUMBER(10,0),
  "P_BATCHRETAIL_ID" NUMBER(10,0),
  "DOCNO" VARCHAR2(50 BYTE),
  "BILLDATE" NUMBER(8,0),
  "STORENAME" VARCHAR2(100 BYTE),
  "DESCRIPTION" VARCHAR2(200 BYTE),
  "NO" VARCHAR2(80 BYTE),
  "PRICEACTUAL" NUMBER(14,4),
  "QTY" NUMBER(10,0),
  "IS_CHECK" CHAR(1 BYTE) DEFAULT 'N',
  "IS_IMP" CHAR(1 BYTE) DEFAULT 'N',
  "OWNERID" NUMBER(10,0),
  "MODIFIERID" NUMBER(10,0),
  "CREATIONDATE" DATE,
  "MODIFIEDDATE" DATE,
  "ISACTIVE" CHAR(1 BYTE) DEFAULT 'Y' NOT NULL,
  "VIPNO" VARCHAR2(100 BYTE)
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
-- Primary Key structure for table P_BATCHRETAILITEM
-- ----------------------------
ALTER TABLE "BOSNDS3"."P_BATCHRETAILITEM" ADD CONSTRAINT "SYS_C0027801" PRIMARY KEY ("ID");

-- ----------------------------
-- Checks structure for table P_BATCHRETAILITEM
-- ----------------------------
ALTER TABLE "BOSNDS3"."P_BATCHRETAILITEM" ADD CONSTRAINT "SYS_C0023548" CHECK ("ID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BOSNDS3"."P_BATCHRETAILITEM" ADD CONSTRAINT "SYS_C0023549" CHECK ("ISACTIVE" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- ----------------------------
-- Foreign Keys structure for table P_BATCHRETAILITEM
-- ----------------------------
ALTER TABLE "BOSNDS3"."P_BATCHRETAILITEM" ADD CONSTRAINT "FK_P_BATCHRETAILITEM_130173" FOREIGN KEY ("P_BATCHRETAIL_ID") REFERENCES "BOSNDS3"."P_BATCHRETAIL" ("ID") ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
