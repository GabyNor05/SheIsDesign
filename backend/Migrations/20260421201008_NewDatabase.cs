using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS ""Event"" (
                    ""Id"" serial PRIMARY KEY,
                    name text NOT NULL,
                    start_date date NOT NULL,
                    end_date date NOT NULL,
                    entry_count integer NOT NULL,
                    description text NOT NULL,
                    max_entery integer NOT NULL,
                    category text NOT NULL,
                    points_reward integer NOT NULL,
                    status text NOT NULL,
                    image_link text NOT NULL
                );

                CREATE TABLE IF NOT EXISTS ""Users"" (
                    ""Id"" serial PRIMARY KEY,
                    email text NOT NULL,
                    password text NOT NULL,
                    ""DateCreated"" timestamptz NOT NULL,
                    roles text NOT NULL
                );

                CREATE TABLE IF NOT EXISTS ""Donation"" (
                    ""Id"" serial PRIMARY KEY,
                    donor_name text NOT NULL,
                    ""eventId"" integer NOT NULL REFERENCES ""Event""(""Id"") ON DELETE CASCADE,
                    amount real NOT NULL,
                    date timestamptz NOT NULL,
                    notes text NOT NULL
                );

                CREATE TABLE IF NOT EXISTS ""Mentee"" (
                    ""Id"" serial PRIMARY KEY,
                    fullname text NOT NULL,
                    university text NOT NULL,
                    year_of_study integer NOT NULL,
                    field_of_study text NOT NULL,
                    ""userId"" integer NOT NULL REFERENCES ""Users""(""Id"") ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS ""Volenteer"" (
                    ""Id"" serial PRIMARY KEY,
                    ""eventCount"" integer NOT NULL,
                    ""userId"" integer NOT NULL REFERENCES ""Users""(""Id"") ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS ""Comment"" (
                    ""Id"" serial PRIMARY KEY,
                    body text NOT NULL,
                    ""userId"" integer NOT NULL REFERENCES ""Users""(""Id"") ON DELETE CASCADE,
                    ""menteeId"" integer NOT NULL REFERENCES ""Mentee""(""Id"") ON DELETE CASCADE,
                    ""timeStamp"" timestamptz NOT NULL
                );

                CREATE TABLE IF NOT EXISTS ""Post"" (
                    ""Id"" serial PRIMARY KEY,
                    title text NOT NULL,
                    ""menteeId"" integer NOT NULL REFERENCES ""Mentee""(""Id"") ON DELETE CASCADE,
                    image_file_link text NOT NULL,
                    category text NOT NULL,
                    ""eventId"" integer NOT NULL REFERENCES ""Event""(""Id"") ON DELETE CASCADE,
                    link_count integer NOT NULL,
                    comment_count integer NOT NULL,
                    post_date timestamptz NOT NULL,
                    description text NOT NULL,
                    status text NOT NULL
                );

                CREATE TABLE IF NOT EXISTS ""Submission"" (
                    ""Id"" serial PRIMARY KEY,
                    ""menteeId"" integer NOT NULL REFERENCES ""Mentee""(""Id"") ON DELETE CASCADE,
                    title text NOT NULL,
                    status text NOT NULL,
                    points integer NOT NULL,
                    rank integer NOT NULL
                );

                CREATE INDEX IF NOT EXISTS ""IX_Comment_menteeId"" ON ""Comment""(""menteeId"");
                CREATE INDEX IF NOT EXISTS ""IX_Comment_userId"" ON ""Comment""(""userId"");
                CREATE INDEX IF NOT EXISTS ""IX_Donation_eventId"" ON ""Donation""(""eventId"");
                CREATE INDEX IF NOT EXISTS ""IX_Mentee_userId"" ON ""Mentee""(""userId"");
                CREATE INDEX IF NOT EXISTS ""IX_Post_eventId"" ON ""Post""(""eventId"");
                CREATE INDEX IF NOT EXISTS ""IX_Post_menteeId"" ON ""Post""(""menteeId"");
                CREATE INDEX IF NOT EXISTS ""IX_Submission_menteeId"" ON ""Submission""(""menteeId"");
                CREATE INDEX IF NOT EXISTS ""IX_Volenteer_userId"" ON ""Volenteer""(""userId"");
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comment");

            migrationBuilder.DropTable(
                name: "Donation");

            migrationBuilder.DropTable(
                name: "Post");

            migrationBuilder.DropTable(
                name: "Submission");

            migrationBuilder.DropTable(
                name: "Volenteer");

            migrationBuilder.DropTable(
                name: "Event");

            migrationBuilder.DropTable(
                name: "Mentee");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
