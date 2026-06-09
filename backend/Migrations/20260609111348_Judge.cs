using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Judge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Submission_Student_studentId",
                table: "Submission");

            migrationBuilder.AddColumn<string>(
                name: "fullname",
                table: "IndustryProfessional",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int[]>(
                name: "AssignedJudgeIDs",
                table: "Event",
                type: "integer[]",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Judge",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IndustryProfessionalId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Judge", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Judge_IndustryProfessional_IndustryProfessionalId",
                        column: x => x.IndustryProfessionalId,
                        principalTable: "IndustryProfessional",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Judge_IndustryProfessionalId",
                table: "Judge",
                column: "IndustryProfessionalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Submission_Student_studentId",
                table: "Submission",
                column: "studentId",
                principalTable: "Student",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Submission_Student_studentId",
                table: "Submission");

            migrationBuilder.DropTable(
                name: "Judge");

            migrationBuilder.DropColumn(
                name: "fullname",
                table: "IndustryProfessional");

            migrationBuilder.DropColumn(
                name: "AssignedJudgeIDs",
                table: "Event");

            migrationBuilder.AddForeignKey(
                name: "FK_Submission_Student_studentId",
                table: "Submission",
                column: "studentId",
                principalTable: "Student",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
