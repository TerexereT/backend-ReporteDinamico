import {MigrationInterface, QueryRunner} from "typeorm";

export class Primera1658522413925 implements MigrationInterface {
    name = 'Primera1658522413925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "milpagos".."views" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "root" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_a5d821bd12a20c9e7bcd8fe5678" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_a8b7f725007cb9ddd8098a71813" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_04f7f71efc2398d52010a4ab30e" DEFAULT getdate(), CONSTRAINT "PK_ae7537f375649a618fff0fb2cb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_38fe21e30fe436a3a35562fcfe" ON "milpagos".."views" ("root") `);
        await queryRunner.query(`CREATE TABLE "milpagos".."views_x_department" ("id" int NOT NULL IDENTITY(1,1), "active" int NOT NULL CONSTRAINT "DF_6f3e90f5a389a570ec305cf1c52" DEFAULT 1, "id_department" int, "id_views" int, CONSTRAINT "PK_1ad5d4c4131c4c46f4052bb626e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6bedd09cdfa3b22e868afdb87c" ON "milpagos".."views_x_department" ("id_department", "id_views") `);
        await queryRunner.query(`CREATE TABLE "milpagos".."department" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_a0a617cd021b1c9e608ca43c745" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_7fab33683a2bfb9bcfa001aa995" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_633cc6089e6ceb143dfd64a0ca0" DEFAULT getdate(), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "milpagos".."department" ("name") `);
        await queryRunner.query(`CREATE TABLE "milpagos".."roles" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_8879c4534a254c4b0871adc75ba" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4d018866397b1e7e78d03b45662" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_c13070745ded32a88c920015f7e" DEFAULT getdate(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "milpagos".."fm_permissions" ("id" int NOT NULL IDENTITY(1,1), "active" int NOT NULL CONSTRAINT "DF_e2feba4cee07276af9673810d0f" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_ce5753d361d44678147e921fdc1" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_851edf4d0d05b95acce6e771cd7" DEFAULT getdate(), "id_department" int, "id_rol" int, "id_action" int, CONSTRAINT "PK_a438484999e4fcf874fde36e643" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c9ff6a42bad0b6e7fc55202e8d" ON "milpagos".."fm_permissions" ("id_department", "id_rol", "id_action") `);
        await queryRunner.query(`CREATE TABLE "milpagos".."actions" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "description" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_518723f5b5d234707f8ec0e4569" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_772bb765d8b7f552174e815c67c" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_405998cf04de4518f9f0f3a6365" DEFAULT getdate(), "id_views" int, CONSTRAINT "PK_7bfb822f56be449c0b8adbf83cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "milpagos".."usuario_x_work" ("id" int NOT NULL IDENTITY(1,1), "active" int NOT NULL CONSTRAINT "DF_f75e4b1b1a7cfb582cd5b18c272" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_30f742650554c4ccd47fd0f0d53" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_a591de616990e6337d1c664ee92" DEFAULT getdate(), "id_usuario" int, "id_rol" int, "id_department" int, CONSTRAINT "PK_6d3f7f650e7c408d15942e34bf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_05f6dcd7b42db74a1be16270db" ON "milpagos".."usuario_x_work" ("id_usuario") WHERE "id_usuario" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_905be363fbc78035c90476d7b1" ON "milpagos".."usuario_x_work" ("id_rol") WHERE "id_rol" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_44d0c2c8b6b5414a395b82d0a9" ON "milpagos".."usuario_x_work" ("id_department") WHERE "id_department" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "milpagos".."views_x_department" ADD CONSTRAINT "FK_7dfe8e94026d302dda3f426c3f6" FOREIGN KEY ("id_department") REFERENCES "milpagos".."department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."views_x_department" ADD CONSTRAINT "FK_543978971a5f021b9d1304c037e" FOREIGN KEY ("id_views") REFERENCES "milpagos".."views"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" ADD CONSTRAINT "FK_09c1b4a3280d58aa85ac2916693" FOREIGN KEY ("id_department") REFERENCES "milpagos".."department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" ADD CONSTRAINT "FK_c6b065b479e904ea7a539bc8e65" FOREIGN KEY ("id_rol") REFERENCES "milpagos".."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" ADD CONSTRAINT "FK_4091c8dc975d7ec31b3e072bdbf" FOREIGN KEY ("id_action") REFERENCES "milpagos".."actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."actions" ADD CONSTRAINT "FK_dd8cca9369ae4fee07d2a26c22c" FOREIGN KEY ("id_views") REFERENCES "milpagos".."views"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."usuario_x_work" ADD CONSTRAINT "FK_05f6dcd7b42db74a1be16270db9" FOREIGN KEY ("id_usuario") REFERENCES "milpagos".."usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."usuario_x_work" ADD CONSTRAINT "FK_905be363fbc78035c90476d7b18" FOREIGN KEY ("id_rol") REFERENCES "milpagos".."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."usuario_x_work" ADD CONSTRAINT "FK_44d0c2c8b6b5414a395b82d0a93" FOREIGN KEY ("id_department") REFERENCES "milpagos".."department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "milpagos".."usuario_x_work" DROP CONSTRAINT "FK_44d0c2c8b6b5414a395b82d0a93"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."usuario_x_work" DROP CONSTRAINT "FK_905be363fbc78035c90476d7b18"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."usuario_x_work" DROP CONSTRAINT "FK_05f6dcd7b42db74a1be16270db9"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."actions" DROP CONSTRAINT "FK_dd8cca9369ae4fee07d2a26c22c"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" DROP CONSTRAINT "FK_4091c8dc975d7ec31b3e072bdbf"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" DROP CONSTRAINT "FK_c6b065b479e904ea7a539bc8e65"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" DROP CONSTRAINT "FK_09c1b4a3280d58aa85ac2916693"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."views_x_department" DROP CONSTRAINT "FK_543978971a5f021b9d1304c037e"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."views_x_department" DROP CONSTRAINT "FK_7dfe8e94026d302dda3f426c3f6"`);
        await queryRunner.query(`DROP INDEX "REL_44d0c2c8b6b5414a395b82d0a9" ON "milpagos".."usuario_x_work"`);
        await queryRunner.query(`DROP INDEX "REL_905be363fbc78035c90476d7b1" ON "milpagos".."usuario_x_work"`);
        await queryRunner.query(`DROP INDEX "REL_05f6dcd7b42db74a1be16270db" ON "milpagos".."usuario_x_work"`);
        await queryRunner.query(`DROP TABLE "milpagos".."usuario_x_work"`);
        await queryRunner.query(`DROP TABLE "milpagos".."actions"`);
        await queryRunner.query(`DROP INDEX "IDX_c9ff6a42bad0b6e7fc55202e8d" ON "milpagos".."fm_permissions"`);
        await queryRunner.query(`DROP TABLE "milpagos".."fm_permissions"`);
        await queryRunner.query(`DROP TABLE "milpagos".."roles"`);
        await queryRunner.query(`DROP INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "milpagos".."department"`);
        await queryRunner.query(`DROP TABLE "milpagos".."department"`);
        await queryRunner.query(`DROP INDEX "IDX_6bedd09cdfa3b22e868afdb87c" ON "milpagos".."views_x_department"`);
        await queryRunner.query(`DROP TABLE "milpagos".."views_x_department"`);
        await queryRunner.query(`DROP INDEX "IDX_38fe21e30fe436a3a35562fcfe" ON "milpagos".."views"`);
        await queryRunner.query(`DROP TABLE "milpagos".."views"`);
    }

}
