import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1666637355009 implements MigrationInterface {
    name = 'Migration1666637355009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agregador" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "key" int NOT NULL, CONSTRAINT "PK_24296609d93b9c8b2125b826ec4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_8879c4534a254c4b0871adc75ba" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4d018866397b1e7e78d03b45662" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_c13070745ded32a88c920015f7e" DEFAULT getdate(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Usuarios" ("id" int NOT NULL IDENTITY(1,1), "login" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "id_type" nvarchar(255) NOT NULL, "ident" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_8ea30944c02c793cc28ce98e68c" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_486654875d84763c946f1e2c739" DEFAULT getdate(), "estatus" int NOT NULL, "departmentId" int, "rolId" int, "statusId" int, CONSTRAINT "PK_6b4c9e5c7d35b294307b3fd0fea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6d831da89d1af23a619faa299e" ON "Usuarios" ("id_type", "ident") `);
        await queryRunner.query(`CREATE TABLE "department" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_a0a617cd021b1c9e608ca43c745" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_7fab33683a2bfb9bcfa001aa995" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_633cc6089e6ceb143dfd64a0ca0" DEFAULT getdate(), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "department" ("name") `);
        await queryRunner.query(`CREATE TABLE "origin_logs" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_e70649ca2d0953e9423376fc545" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "general_logs" ("id" int NOT NULL IDENTITY(1,1), "descript" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_026abf71d97cbc51dd1090c7f4d" DEFAULT getdate(), "idUserId" int, "id_origin_logs" int, CONSTRAINT "PK_7a29767ad952aab18d5b2df6b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_c86fb7f4dc0ddec1031c422cab8" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_6b38d991aa6cc2441bf24b0da22" FOREIGN KEY ("rolId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_0ffde2a9c23cdadbda9fa63f5a0" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "general_logs" ADD CONSTRAINT "FK_f5125280936b000248ba9981a33" FOREIGN KEY ("idUserId") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "general_logs" ADD CONSTRAINT "FK_a9ebaa9beeca8aafa085ea66bb5" FOREIGN KEY ("id_origin_logs") REFERENCES "origin_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "general_logs" DROP CONSTRAINT "FK_a9ebaa9beeca8aafa085ea66bb5"`);
        await queryRunner.query(`ALTER TABLE "general_logs" DROP CONSTRAINT "FK_f5125280936b000248ba9981a33"`);
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP CONSTRAINT "FK_0ffde2a9c23cdadbda9fa63f5a0"`);
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP CONSTRAINT "FK_6b38d991aa6cc2441bf24b0da22"`);
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP CONSTRAINT "FK_c86fb7f4dc0ddec1031c422cab8"`);
        await queryRunner.query(`DROP TABLE "general_logs"`);
        await queryRunner.query(`DROP TABLE "origin_logs"`);
        await queryRunner.query(`DROP INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "department"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP INDEX "IDX_6d831da89d1af23a619faa299e" ON "Usuarios"`);
        await queryRunner.query(`DROP TABLE "Usuarios"`);
        await queryRunner.query(`DROP TABLE "status"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "agregador"`);
    }

}
