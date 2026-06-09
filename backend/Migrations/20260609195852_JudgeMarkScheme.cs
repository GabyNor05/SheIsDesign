using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class JudgeMarkScheme : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Donation_Event_eventId",
                table: "Donation");

            migrationBuilder.AlterColumn<int>(
                name: "eventId",
                table: "Donation",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateTable(
                name: "JudgeMarkScheme",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PostId = table.Column<int>(type: "integer", nullable: false),
                    JudgeId = table.Column<int>(type: "integer", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JudgeMarkScheme", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JudgeMarkScheme_Judge_JudgeId",
                        column: x => x.JudgeId,
                        principalTable: "Judge",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JudgeMarkScheme_Post_PostId",
                        column: x => x.PostId,
                        principalTable: "Post",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JudgeMarkScheme_JudgeId",
                table: "JudgeMarkScheme",
                column: "JudgeId");

            migrationBuilder.CreateIndex(
                name: "IX_JudgeMarkScheme_PostId",
                table: "JudgeMarkScheme",
                column: "PostId");

            migrationBuilder.AddForeignKey(
                name: "FK_Donation_Event_eventId",
                table: "Donation",
                column: "eventId",
                principalTable: "Event",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Donation_Event_eventId",
                table: "Donation");

            migrationBuilder.DropTable(
                name: "JudgeMarkScheme");

            migrationBuilder.AlterColumn<int>(
                name: "eventId",
                table: "Donation",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Donation_Event_eventId",
                table: "Donation",
                column: "eventId",
                principalTable: "Event",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
