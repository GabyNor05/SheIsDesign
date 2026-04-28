---
name: database-migration
description: "Guides Entity Framework Core migration workflows for the SheIsDesign PostgreSQL database. Covers creating, applying, naming, and rolling back migrations safely. Use when adding a new table or entity, modifying an existing schema (adding/renaming/removing columns), creating seed data, or resolving migration conflicts."
argument-hint: "[entity or schema change to migrate]"
user-invocable: true
disable-model-invocation: false
---

# SheIsDesign — Database Migration Skill

## Stack Reference
- **ORM:** Entity Framework Core (EF Core)
- **Database:** PostgreSQL
- **EF Provider:** `Npgsql.EntityFrameworkCore.PostgreSQL`
- **Migration Location:** `backend/SheIsDesign.Data/Migrations/`

---

## Install
```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet tool install --global dotnet-ef
```

---

## 1. DbContext Setup
```csharp
// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Core tables — add each entity here as a DbSet
    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Competition> Competitions => Set<Competition>();
    public DbSet<CompetitionEntry> CompetitionEntries => Set<CompetitionEntry>();
    public DbSet<PortfolioEntry> PortfolioEntries => Set<PortfolioEntry>();
    public DbSet<EventSignUp> EventSignUps => Set<EventSignUp>();
    public DbSet<Donation> Donations => Set<Donation>();
    public DbSet<PointTransaction> PointTransactions => Set<PointTransaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all entity configurations from the same assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

### Register in Program.cs
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### Connection String (appsettings.Development.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=sheisdesign_dev;Username=postgres;Password=yourpassword"
  }
}
```

> **Rule:** Never commit real passwords. Use `dotnet user-secrets` locally or environment variables in deployment.

---

## 2. Entity Configuration Pattern

Use Fluent API configuration files instead of Data Annotations for complex relationships.

```csharp
// Data/Configurations/EventConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Date)
            .IsRequired();

        builder.Property(e => e.Capacity)
            .IsRequired()
            .HasDefaultValue(50);

        // Relationship: one event has many sign-ups
        builder.HasMany(e => e.SignUps)
            .WithOne(s => s.Event)
            .HasForeignKey(s => s.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

---

## 3. Migration Commands — Daily Workflow

### Creating a New Migration
```bash
# Always run from the solution root or backend project directory
# Replace [MigrationName] with a descriptive PascalCase name

# Adding a new table
dotnet ef migrations add AddPortfolioEntryTable --project SheIsDesign.Data --startup-project SheIsDesign.Api

# Adding a column to an existing table
dotnet ef migrations add AddCategoryColumnToPortfolioEntry --project SheIsDesign.Data --startup-project SheIsDesign.Api

# Adding a relationship
dotnet ef migrations add AddEventSignUpRelationship --project SheIsDesign.Data --startup-project SheIsDesign.Api
```

### Applying Migrations (Update Database)
```bash
# Apply all pending migrations to the local dev database
dotnet ef database update --project SheIsDesign.Data --startup-project SheIsDesign.Api

# Apply up to a specific migration (useful for partial rollback)
dotnet ef database update AddPortfolioEntryTable --project SheIsDesign.Data --startup-project SheIsDesign.Api
```

### Rolling Back a Migration
```bash
# Step 1: Revert the database to the previous migration
dotnet ef database update PreviousMigrationName --project SheIsDesign.Data --startup-project SheIsDesign.Api

# Step 2: Remove the bad migration file
dotnet ef migrations remove --project SheIsDesign.Data --startup-project SheIsDesign.Api
```

### Listing Migrations
```bash
# See all migrations and their applied status
dotnet ef migrations list --project SheIsDesign.Data --startup-project SheIsDesign.Api
```

---

## 4. Migration Naming Conventions

Always use descriptive PascalCase names that describe the change clearly:

| Change Type | Good Name | Bad Name |
|---|---|---|
| New table | `AddCompetitionTable` | `Migration1` |
| New column | `AddCategoryToPortfolioEntry` | `UpdatePortfolio` |
| Rename column | `RenameUserNameToFullName` | `FixUser` |
| New relationship | `AddEventSignUpRelationship` | `NewFK` |
| Seed data | `SeedDefaultAdminUser` | `AddData` |
| Drop table | `RemoveEquipmentLoanTable` | `Cleanup` |

---

## 5. Seed Data
```csharp
// Data/Migrations/SeedDefaultAdminUser.cs
// OR inside OnModelCreating with HasData()

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Seed a default admin user (password must be pre-hashed)
    modelBuilder.Entity<ApplicationUser>().HasData(new ApplicationUser
    {
        Id = "seed-admin-001",
        FullName = "SheIsDesign Admin",
        Email = "admin@sheis.design",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("ChangeMe123!"),
        Role = "admin",
        CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
    });
}
```

---

## 6. Auto-Apply Migrations on Startup (Development Only)

```csharp
// Program.cs — after app is built, before app.Run()
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // Apply any pending migrations automatically
}
```

> **Warning:** Never use `Database.Migrate()` in production startup — run migrations as a separate deployment step.

---

## 7. SheIsDesign Core Entity Checklist

Track which entities have been migrated:

| Entity | Migration Name | Status |
|---|---|---|
| `ApplicationUser` | `InitialCreate` | Core |
| `Event` | `AddEventTable` | Core |
| `EventSignUp` | `AddEventSignUpRelationship` | Core |
| `Competition` | `AddCompetitionTable` | Core |
| `CompetitionEntry` | `AddCompetitionEntryTable` | Core |
| `PortfolioEntry` | `AddPortfolioEntryTable` | Core |
| `Donation` | `AddDonationTable` | Core |
| `PointTransaction` | `AddPointsLeaderboardTables` | Core |

---

## Migration Safety Rules

1. **Never edit a migration file after it has been applied** — create a new one instead
2. **Always review the generated migration file** before applying — check for accidental `DROP COLUMN` statements
3. **Backup the database** before running migrations on shared/staging environments
4. **One concern per migration** — don't add a table AND seed data in the same migration
5. **Run `migrations list`** before creating a new one to confirm your baseline
