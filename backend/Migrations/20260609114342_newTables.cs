using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class newTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Judge_IndustryProfessional_IndustryProfessionalId",
                table: "Judge");

            migrationBuilder.RenameColumn(
                name: "IndustryProfessionalId",
                table: "Judge",
                newName: "IndustryProfessionalID");

            migrationBuilder.RenameIndex(
                name: "IX_Judge_IndustryProfessionalId",
                table: "Judge",
                newName: "IX_Judge_IndustryProfessionalID");

            migrationBuilder.AlterColumn<int>(
                name: "IndustryProfessionalID",
                table: "Judge",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Judge_IndustryProfessional_IndustryProfessionalID",
                table: "Judge",
                column: "IndustryProfessionalID",
                principalTable: "IndustryProfessional",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Judge_IndustryProfessional_IndustryProfessionalID",
                table: "Judge");

            migrationBuilder.RenameColumn(
                name: "IndustryProfessionalID",
                table: "Judge",
                newName: "IndustryProfessionalId");

            migrationBuilder.RenameIndex(
                name: "IX_Judge_IndustryProfessionalID",
                table: "Judge",
                newName: "IX_Judge_IndustryProfessionalId");

            migrationBuilder.AlterColumn<int>(
                name: "IndustryProfessionalId",
                table: "Judge",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Judge_IndustryProfessional_IndustryProfessionalId",
                table: "Judge",
                column: "IndustryProfessionalId",
                principalTable: "IndustryProfessional",
                principalColumn: "Id");
        }
    }
}
