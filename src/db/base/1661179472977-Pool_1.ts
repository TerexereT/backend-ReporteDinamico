import {MigrationInterface, QueryRunner} from "typeorm";

export class Pool11661179472977 implements MigrationInterface {
    name = 'Pool11661179472977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "milpagos".."views" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "root" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_a5d821bd12a20c9e7bcd8fe5678" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_a8b7f725007cb9ddd8098a71813" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_04f7f71efc2398d52010a4ab30e" DEFAULT getdate(), CONSTRAINT "PK_ae7537f375649a618fff0fb2cb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_38fe21e30fe436a3a35562fcfe" ON "milpagos".."views" ("root") `);
        await queryRunner.query(`CREATE TABLE "milpagos".."ViewsXDep" ("id" int NOT NULL IDENTITY(1,1), "active" int NOT NULL CONSTRAINT "DF_0df76adc4006c51e40d07168cea" DEFAULT 1, "id_department" int, "id_views" int, CONSTRAINT "PK_76e155cd590abb7070ea412738d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a0929194d1202545bd360e34fb" ON "milpagos".."ViewsXDep" ("id_department", "id_views") `);
        await queryRunner.query(`CREATE TABLE "milpagos".."department" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_a0a617cd021b1c9e608ca43c745" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_7fab33683a2bfb9bcfa001aa995" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_633cc6089e6ceb143dfd64a0ca0" DEFAULT getdate(), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "milpagos".."department" ("name") `);
        await queryRunner.query(`CREATE TABLE "milpagos".."roles" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_8879c4534a254c4b0871adc75ba" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4d018866397b1e7e78d03b45662" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_c13070745ded32a88c920015f7e" DEFAULT getdate(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "milpagos".."fm_permissions" ("id" int NOT NULL IDENTITY(1,1), "active" int NOT NULL CONSTRAINT "DF_e2feba4cee07276af9673810d0f" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_ce5753d361d44678147e921fdc1" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_851edf4d0d05b95acce6e771cd7" DEFAULT getdate(), "id_department" int, "id_rol" int, "id_action" int, CONSTRAINT "PK_a438484999e4fcf874fde36e643" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c9ff6a42bad0b6e7fc55202e8d" ON "milpagos".."fm_permissions" ("id_department", "id_rol", "id_action") `);
        await queryRunner.query(`CREATE TABLE "milpagos".."actions" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "description" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_518723f5b5d234707f8ec0e4569" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_772bb765d8b7f552174e815c67c" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_405998cf04de4518f9f0f3a6365" DEFAULT getdate(), "id_views" int, CONSTRAINT "PK_7bfb822f56be449c0b8adbf83cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "milpagos".."contra_cargo" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_c9593a5ce0226d6ae095de62021" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_9e5032bf32cb0b2e73c27e3bd58" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_45a16a0539fe7b36e7aed825d12" DEFAULT getdate(), CONSTRAINT "PK_e150b9292a14450285f43f60679" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_65cada11aceb02caf4726b7b5a" ON "milpagos".."contra_cargo" ("name") `);
        await queryRunner.query(`CREATE TABLE "milpagos".."Usuario_Work" ("id" int NOT NULL IDENTITY(1,1), "active" int NOT NULL CONSTRAINT "DF_85e1c52593395bb9306eb22fcc3" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_35de4ca069bb5fb3a0b405c9294" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_86aaf9a29ce372a6cf7e973d512" DEFAULT getdate(), "id_usuario" int, "id_rol" int, "id_department" int, CONSTRAINT "PK_e722302ed16fc3721466debef53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_e645dc23f907f0385201325f78" ON "milpagos".."Usuario_Work" ("id_usuario") WHERE "id_usuario" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_77fadfb068301c4b22f4a717f7" ON "milpagos".."Usuario_Work" ("id_rol") WHERE "id_rol" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_8ef0ac2857b72c9009cc4f9d15" ON "milpagos".."Usuario_Work" ("id_department") WHERE "id_department" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "milpagos".."ViewsXDep" ADD CONSTRAINT "FK_30a19887dcd8877d2e28f4c195a" FOREIGN KEY ("id_department") REFERENCES "milpagos".."department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."ViewsXDep" ADD CONSTRAINT "FK_f744ae54b4f4832dc8df7053a89" FOREIGN KEY ("id_views") REFERENCES "milpagos".."views"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" ADD CONSTRAINT "FK_09c1b4a3280d58aa85ac2916693" FOREIGN KEY ("id_department") REFERENCES "milpagos".."department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" ADD CONSTRAINT "FK_c6b065b479e904ea7a539bc8e65" FOREIGN KEY ("id_rol") REFERENCES "milpagos".."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" ADD CONSTRAINT "FK_4091c8dc975d7ec31b3e072bdbf" FOREIGN KEY ("id_action") REFERENCES "milpagos".."actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."actions" ADD CONSTRAINT "FK_dd8cca9369ae4fee07d2a26c22c" FOREIGN KEY ("id_views") REFERENCES "milpagos".."views"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."Usuario_Work" ADD CONSTRAINT "FK_e645dc23f907f0385201325f786" FOREIGN KEY ("id_usuario") REFERENCES "milpagos".."usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."Usuario_Work" ADD CONSTRAINT "FK_77fadfb068301c4b22f4a717f78" FOREIGN KEY ("id_rol") REFERENCES "milpagos".."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos".."Usuario_Work" ADD CONSTRAINT "FK_8ef0ac2857b72c9009cc4f9d15b" FOREIGN KEY ("id_department") REFERENCES "milpagos".."department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "milpagos".."Usuario_Work" DROP CONSTRAINT "FK_8ef0ac2857b72c9009cc4f9d15b"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."Usuario_Work" DROP CONSTRAINT "FK_77fadfb068301c4b22f4a717f78"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."Usuario_Work" DROP CONSTRAINT "FK_e645dc23f907f0385201325f786"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."actions" DROP CONSTRAINT "FK_dd8cca9369ae4fee07d2a26c22c"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" DROP CONSTRAINT "FK_4091c8dc975d7ec31b3e072bdbf"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" DROP CONSTRAINT "FK_c6b065b479e904ea7a539bc8e65"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."fm_permissions" DROP CONSTRAINT "FK_09c1b4a3280d58aa85ac2916693"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."ViewsXDep" DROP CONSTRAINT "FK_f744ae54b4f4832dc8df7053a89"`);
        await queryRunner.query(`ALTER TABLE "milpagos".."ViewsXDep" DROP CONSTRAINT "FK_30a19887dcd8877d2e28f4c195a"`);
        await queryRunner.query(`DROP INDEX "REL_8ef0ac2857b72c9009cc4f9d15" ON "milpagos".."Usuario_Work"`);
        await queryRunner.query(`DROP INDEX "REL_77fadfb068301c4b22f4a717f7" ON "milpagos".."Usuario_Work"`);
        await queryRunner.query(`DROP INDEX "REL_e645dc23f907f0385201325f78" ON "milpagos".."Usuario_Work"`);
        await queryRunner.query(`DROP TABLE "milpagos".."Usuario_Work"`);
        await queryRunner.query(`DROP INDEX "IDX_65cada11aceb02caf4726b7b5a" ON "milpagos".."contra_cargo"`);
        await queryRunner.query(`DROP TABLE "milpagos".."contra_cargo"`);
        await queryRunner.query(`DROP TABLE "milpagos".."actions"`);
        await queryRunner.query(`DROP INDEX "IDX_c9ff6a42bad0b6e7fc55202e8d" ON "milpagos".."fm_permissions"`);
        await queryRunner.query(`DROP TABLE "milpagos".."fm_permissions"`);
        await queryRunner.query(`DROP TABLE "milpagos".."roles"`);
        await queryRunner.query(`DROP INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "milpagos".."department"`);
        await queryRunner.query(`DROP TABLE "milpagos".."department"`);
        await queryRunner.query(`DROP INDEX "IDX_a0929194d1202545bd360e34fb" ON "milpagos".."ViewsXDep"`);
        await queryRunner.query(`DROP TABLE "milpagos".."ViewsXDep"`);
        await queryRunner.query(`DROP INDEX "IDX_38fe21e30fe436a3a35562fcfe" ON "milpagos".."views"`);
        await queryRunner.query(`DROP TABLE "milpagos".."views"`);
    }

}
