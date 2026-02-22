import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExhibitRelation1771508449604 implements MigrationInterface {
    name = 'AddExhibitRelation1771508449604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exhibit" ("id" SERIAL NOT NULL, "image" character varying NOT NULL, "description" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_cea6ca681dbeff3b69e0961a129" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exhibit" ADD CONSTRAINT "FK_d6cee3785c355f9169d05cf9d8e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exhibit" DROP CONSTRAINT "FK_d6cee3785c355f9169d05cf9d8e"`);
        await queryRunner.query(`DROP TABLE "exhibit"`);
    }

}
