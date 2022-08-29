import {MigrationInterface, QueryRunner} from "typeorm";

export class v21661792487418 implements MigrationInterface {
    name = 'v21661792487418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "milpagos"."dbo"."ejecutado_contracargo" DROP CONSTRAINT "FK_803f0d64b1606c50350471d944c"`);
        await queryRunner.query(`ALTER TABLE "milpagos"."dbo"."Usuario_Work" DROP CONSTRAINT "FK_e645dc23f907f0385201325f786"`);
        await queryRunner.query(`ALTER TABLE "milpagos"."dbo"."ejecutado_contracargo" ADD CONSTRAINT "FK_803f0d64b1606c50350471d944c" FOREIGN KEY ("id_usuario") REFERENCES "milpagos".."usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos"."dbo"."Usuario_Work" ADD CONSTRAINT "FK_e645dc23f907f0385201325f786" FOREIGN KEY ("id_usuario") REFERENCES "milpagos".."usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "milpagos"."dbo"."Usuario_Work" DROP CONSTRAINT "FK_e645dc23f907f0385201325f786"`);
        await queryRunner.query(`ALTER TABLE "milpagos"."dbo"."ejecutado_contracargo" DROP CONSTRAINT "FK_803f0d64b1606c50350471d944c"`);
        await queryRunner.query(`ALTER TABLE "milpagos"."dbo"."Usuario_Work" ADD CONSTRAINT "FK_e645dc23f907f0385201325f786" FOREIGN KEY ("id_usuario") REFERENCES "milpagos".."Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "milpagos"."dbo"."ejecutado_contracargo" ADD CONSTRAINT "FK_803f0d64b1606c50350471d944c" FOREIGN KEY ("id_usuario") REFERENCES "milpagos".."Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
