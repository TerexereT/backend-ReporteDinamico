import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1665761482554 implements MigrationInterface {
    name = 'Migration1665761482554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agregador" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "key" int NOT NULL, CONSTRAINT "PK_24296609d93b9c8b2125b826ec4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_a0a617cd021b1c9e608ca43c745" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_7fab33683a2bfb9bcfa001aa995" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_633cc6089e6ceb143dfd64a0ca0" DEFAULT getdate(), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "department" ("name") `);
        await queryRunner.query(`CREATE TABLE "roles" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_8879c4534a254c4b0871adc75ba" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4d018866397b1e7e78d03b45662" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_c13070745ded32a88c920015f7e" DEFAULT getdate(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Usuarios" ("id" int NOT NULL IDENTITY(1,1), "login" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "id_type" nvarchar(255) NOT NULL, "ident" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_8ea30944c02c793cc28ce98e68c" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_486654875d84763c946f1e2c739" DEFAULT getdate(), "estatus" int NOT NULL, "departmentId" int, "rolId" int, "statusId" int, CONSTRAINT "PK_6b4c9e5c7d35b294307b3fd0fea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_c86fb7f4dc0ddec1031c422cab8" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_6b38d991aa6cc2441bf24b0da22" FOREIGN KEY ("rolId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_0ffde2a9c23cdadbda9fa63f5a0" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP CONSTRAINT "FK_0ffde2a9c23cdadbda9fa63f5a0"`);
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP CONSTRAINT "FK_6b38d991aa6cc2441bf24b0da22"`);
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP CONSTRAINT "FK_c86fb7f4dc0ddec1031c422cab8"`);
        await queryRunner.query(`DROP TABLE "Usuarios"`);
        await queryRunner.query(`DROP TABLE "status"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "department"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "agregador"`);
    }

}
