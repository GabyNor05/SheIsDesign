using Microsoft.EntityFrameworkCore;
using SheDesign.Data;

var builder = WebApplication.CreateBuilder(args);

// Render injects PORT at runtime; fall back to 5160 for local dev
var port = Environment.GetEnvironmentVariable("PORT") ?? "5160";
builder.WebHost.UseUrls($"http://+:{port}");

// CORS origins are comma-separated via env var so no rebuild is needed per environment
var rawOrigins = builder.Configuration["CORS_ALLOWED_ORIGINS"] ?? "http://localhost:3000";
var allowedOrigins = rawOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // "*" wildcard allows all origins; "null" covers Electron packaged apps (file:// protocol)
        policy.SetIsOriginAllowed(origin => allowedOrigins.Contains("*") || allowedOrigins.Contains(origin) || origin == "null")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
        opts.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<SheDesignContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("SheIsDesignDatabase"),
        npgsql => npgsql.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorCodesToAdd: null
        )
    )
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
