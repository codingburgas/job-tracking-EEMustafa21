using JobPortal.API.Data;
using JobPortal.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<JobPortalDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJobService, JobService>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"]!);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<JobPortalDbContext>();
    context.Database.EnsureCreated();
    
    // Seed data
    if (!context.Users.Any())
    {
        var adminUser = new JobPortal.API.Models.User
        {
            FirstName = "Admin",
            LastName = "User",
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
            Role = "ADMIN"
        };
        
        context.Users.Add(adminUser);
        context.SaveChanges();
        
        // Add sample jobs
        var jobs = new List<JobPortal.API.Models.Job>
        {
            new JobPortal.API.Models.Job
            {
                Title = "Senior Frontend Developer",
                CompanyName = "TechCorp Solutions",
                Description = "We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for building user-facing web applications using modern frameworks like React, Angular, or Vue.js. Strong knowledge of HTML, CSS, JavaScript, and responsive design principles is required.",
                DatePosted = DateTime.UtcNow,
                IsActive = true
            },
            new JobPortal.API.Models.Job
            {
                Title = "Full Stack Developer",
                CompanyName = "Innovation Labs",
                Description = "Join our team as a Full Stack Developer and work on cutting-edge projects. You will be developing both frontend and backend components using technologies like Node.js, Python, React, and databases. Experience with cloud platforms is a plus.",
                DatePosted = DateTime.UtcNow.AddDays(-1),
                IsActive = true
            },
            new JobPortal.API.Models.Job
            {
                Title = "Product Manager",
                CompanyName = "StartupXYZ",
                Description = "We are seeking a Product Manager to lead our product development initiatives. You will work closely with engineering, design, and business teams to define product requirements and roadmap. Strong analytical and communication skills are essential.",
                DatePosted = DateTime.UtcNow.AddDays(-2),
                IsActive = true
            },
            new JobPortal.API.Models.Job
            {
                Title = "UI/UX Designer",
                CompanyName = "Creative Agency",
                Description = "Join our creative team as a UI/UX Designer. You will be responsible for creating intuitive and visually appealing user interfaces for web and mobile applications. Proficiency in design tools like Figma, Sketch, or Adobe Creative Suite is required.",
                DatePosted = DateTime.UtcNow.AddDays(-3),
                IsActive = false
            }
        };
        
        context.Jobs.AddRange(jobs);
        context.SaveChanges();
    }
}

app.Run();