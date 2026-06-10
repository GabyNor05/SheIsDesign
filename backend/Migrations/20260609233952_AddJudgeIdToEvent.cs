using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddJudgeIdToEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedJudgeIDs",
                table: "Event");

            migrationBuilder.AddColumn<int>(
                name: "JudgeId",
                table: "Event",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Event_JudgeId",
                table: "Event",
                column: "JudgeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Judge_JudgeId",
                table: "Event",
                column: "JudgeId",
                principalTable: "Judge",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Event_Judge_JudgeId",
                table: "Event");

            migrationBuilder.DropIndex(
                name: "IX_Event_JudgeId",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "JudgeId",
                table: "Event");

            migrationBuilder.AddColumn<int[]>(
                name: "AssignedJudgeIDs",
                table: "Event",
                type: "integer[]",
                nullable: true);
        }
    }
}
