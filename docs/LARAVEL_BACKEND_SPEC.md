# Laravel 12 Backend Specification

This document specifies the complete Laravel 12 backend that pairs with the Next.js frontend. The frontend's API client (`src/lib/api-client.ts`) automatically detects `NEXT_PUBLIC_API_URL` and switches from the built-in Next.js API routes to the Laravel backend.

## Tech Stack
- **Laravel 12** (PHP 8.3+)
- **PostgreSQL 16** (UUIDs via `uuid` package)
- **Redis 7** (sessions, queues, cache, rate limiting)
- **Laravel Sanctum** (token-based SPA auth)
- **AWS S3 / Cloudinary** (file storage)

---

## Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── DepartmentController.php
│   │   │   ├── ProgrammeController.php
│   │   │   ├── NewsController.php
│   │   │   ├── EventController.php
│   │   │   ├── TestimonialController.php
│   │   │   ├── PartnerController.php
│   │   │   ├── GalleryController.php
│   │   │   ├── ApplicationController.php
│   │   │   ├── ContactController.php
│   │   │   ├── NewsletterController.php
│   │   │   ├── Student/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── UnitController.php
│   │   │   │   ├── AssessmentController.php
│   │   │   │   ├── AttendanceController.php
│   │   │   │   ├── ResultController.php
│   │   │   │   ├── FeeController.php
│   │   │   │   ├── ExamCardController.php
│   │   │   │   ├── LibraryController.php
│   │   │   │   ├── NotificationController.php
│   │   │   │   └── MessageController.php
│   │   │   └── Admin/
│   │   │       ├── DashboardController.php
│   │   │       └── AuditLogController.php
│   │   ├── Resources/
│   │   │   ├── UserResource.php
│   │   │   ├── DepartmentResource.php
│   │   │   ├── ProgrammeResource.php
│   │   │   ├── NewsResource.php
│   │   │   ├── StudentResource.php
│   │   │   └── ... (one per model)
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   └── ResetPasswordRequest.php
│   │   │   ├── DepartmentRequest.php
│   │   │   ├── ProgrammeRequest.php
│   │   │   └── ... (one per resource)
│   │   └── Middleware/
│   │       ├── RoleMiddleware.php
│   │       └── AuditLogMiddleware.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Student.php
│   │   ├── Department.php
│   │   ├── Programme.php
│   │   ├── Semester.php
│   │   ├── Unit.php
│   │   ├── Enrollment.php
│   │   ├── Assessment.php
│   │   ├── Submission.php
│   │   ├── Attendance.php
│   │   ├── Result.php
│   │   ├── Fee.php
│   │   ├── Payment.php
│   │   ├── ExamCard.php
│   │   ├── LibraryBook.php
│   │   ├── BookLoan.php
│   │   ├── Hostel.php
│   │   ├── HostelAllocation.php
│   │   ├── Announcement.php
│   │   ├── Notification.php
│   │   ├── Message.php
│   │   ├── News.php
│   │   ├── Event.php
│   │   ├── Testimonial.php
│   │   ├── Partner.php
│   │   ├── GalleryImage.php
│   │   ├── Application.php
│   │   ├── ContactMessage.php
│   │   ├── NewsletterSubscriber.php
│   │   ├── SiteSetting.php
│   │   └── AuditLog.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── StudentService.php
│   │   ├── FeeService.php
│   │   ├── AttendanceService.php
│   │   ├── ResultService.php
│   │   ├── FileUploadService.php
│   │   └── NotificationService.php
│   ├── Repositories/
│   │   ├── Contracts/
│   │   │   ├── UserRepositoryInterface.php
│   │   │   ├── StudentRepositoryInterface.php
│   │   │   └── ... (one per model)
│   │   ├── UserRepository.php
│   │   ├── StudentRepository.php
│   │   └── ... (one per model)
│   ├── Events/
│   │   ├── ApplicationSubmitted.php
│   │   ├── ResultReleased.php
│   │   ├── FeePaid.php
│   │   └── ExamCardIssued.php
│   ├── Listeners/
│   │   ├── SendApplicationNotification.php
│   │   ├── SendResultNotification.php
│   │   └── UpdateStudentGPA.php
│   ├── Notifications/
│   │   ├── ApplicationReceived.php
│   │   ├── ResultReleased.php
│   │   ├── FeeReminder.php
│   │   └── ExamCardReady.php
│   ├── Jobs/
│   │   ├── ProcessFileUpload.php
│   │   ├── SendBulkEmail.php
│   │   └── GenerateExamCards.php
│   └── Providers/
│       ├── AppServiceProvider.php
│       ├── RepositoryServiceProvider.php
│       └── HorizonServiceProvider.php (optional)
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 0002_01_01_000000_create_departments_table.php
│   │   ├── 0002_01_01_000001_create_programmes_table.php
│   │   ├── 0002_01_01_000002_create_semesters_table.php
│   │   ├── 0002_01_01_000003_create_units_table.php
│   │   ├── 0002_01_01_000004_create_students_table.php
│   │   ├── 0002_01_01_000005_create_enrollments_table.php
│   │   ├── 0002_01_01_000006_create_assessments_table.php
│   │   ├── 0002_01_01_000007_create_submissions_table.php
│   │   ├── 0002_01_01_000008_create_attendance_table.php
│   │   ├── 0002_01_01_000009_create_results_table.php
│   │   ├── 0002_01_01_000010_create_fees_table.php
│   │   ├── 0002_01_01_000011_create_payments_table.php
│   │   ├── 0002_01_01_000012_create_exam_cards_table.php
│   │   ├── 0002_01_01_000013_create_library_books_table.php
│   │   ├── 0002_01_01_000014_create_book_loans_table.php
│   │   ├── 0002_01_01_000015_create_hostels_table.php
│   │   ├── 0002_01_01_000016_create_hostel_allocations_table.php
│   │   ├── 0002_01_01_000017_create_news_table.php
│   │   ├── 0002_01_01_000018_create_events_table.php
│   │   ├── 0002_01_01_000019_create_testimonials_table.php
│   │   ├── 0002_01_01_000020_create_partners_table.php
│   │   ├── 0002_01_01_000021_create_gallery_images_table.php
│   │   ├── 0002_01_01_000022_create_applications_table.php
│   │   ├── 0002_01_01_000023_create_contact_messages_table.php
│   │   ├── 0002_01_01_000024_create_newsletter_subscribers_table.php
│   │   ├── 0002_01_01_000025_create_announcements_table.php
│   │   ├── 0002_01_01_000026_create_notifications_table.php
│   │   ├── 0002_01_01_000027_create_messages_table.php
│   │   ├── 0002_01_01_000028_create_site_settings_table.php
│   │   └── 0002_01_01_000029_create_audit_logs_table.php
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── AdminUserSeeder.php
│   │   ├── DepartmentSeeder.php
│   │   ├── ProgrammeSeeder.php
│   │   ├── StudentSeeder.php
│   │   └── SiteSettingSeeder.php
│   └── factories/
│       ├── UserFactory.php
│       ├── StudentFactory.php
│       └── ... (one per model)
├── routes/
│   ├── api.php
│   ├── channels.php
│   └── console.php
├── config/
│   ├── sanctum.php
│   ├── cache.php (Redis driver)
│   ├── queue.php (Redis driver)
│   ├── session.php (Redis driver)
│   ├── filesystems.php (S3 + Cloudinary disks)
│   └── cors.php
├── tests/
│   ├── Unit/
│   │   ├── Services/
│   │   │   ├── AuthServiceTest.php
│   │   │   └── FeeServiceTest.php
│   │   └── Repositories/
│   │       └── UserRepositoryTest.php
│   ├── Feature/
│   │   ├── Auth/
│   │   │   ├── LoginTest.php
│   │   │   ├── RegisterTest.php
│   │   │   └── PasswordResetTest.php
│   │   ├── DepartmentControllerTest.php
│   │   ├── StudentDashboardTest.php
│   │   └── ApplicationSubmitTest.php
│   └── TestCase.php
├── .env.example
└── composer.json
```

---

## API Routes (routes/api.php)

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\ProgrammeController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\Student\DashboardController;
use App\Http\Controllers\Api\Student\UnitController;
use App\Http\Controllers\Api\Student\AssessmentController;
use App\Http\Controllers\Api\Student\AttendanceController;
use App\Http\Controllers\Api\Student\ResultController;
use App\Http\Controllers\Api\Student\FeeController;
use App\Http\Controllers\Api\Student\ExamCardController;
use App\Http\Controllers\Api\Student\LibraryController;
use App\Http\Controllers\Api\Student\NotificationController;
use App\Http\Controllers\Api\Student\MessageController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\AuditLogController;
use App\Http\Middleware\RoleMiddleware;

// Public auth routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    Route::post('demo-login', [AuthController::class, 'demoLogin']);
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('email/verification-notification', [AuthController::class, 'sendVerification']);
        Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail']);
    });

    // Public content (read-only, no auth needed but cached)
    Route::get('departments', [DepartmentController::class, 'index']);
    Route::get('departments/{id}', [DepartmentController::class, 'show']);
    Route::get('programmes', [ProgrammeController::class, 'index']);
    Route::get('programmes/{id}', [ProgrammeController::class, 'show']);
    Route::get('news', [NewsController::class, 'index']);
    Route::get('news/{slug}', [NewsController::class, 'show']);
    Route::get('events', [EventController::class, 'index']);
    Route::get('testimonials', [TestimonialController::class, 'index']);
    Route::get('partners', [PartnerController::class, 'index']);
    Route::get('gallery', [GalleryController::class, 'index']);

    // Public forms
    Route::post('applications', [ApplicationController::class, 'store']);
    Route::post('contact', [ContactController::class, 'store']);
    Route::post('newsletter', [NewsletterController::class, 'store']);

    // Admin/Editor CRUD (role middleware)
    Route::middleware(['role:ADMIN,EDITOR'])->group(function () {
        Route::apiResource('departments', DepartmentController::class)->except(['index', 'show']);
        Route::apiResource('programmes', ProgrammeController::class)->except(['index', 'show']);
        Route::apiResource('news', NewsController::class)->except(['index', 'show']);
        Route::apiResource('events', EventController::class)->except(['index', 'show']);
        Route::apiResource('testimonials', TestimonialController::class)->except(['index', 'show']);
        Route::apiResource('partners', PartnerController::class)->except(['index', 'show']);
        Route::apiResource('gallery', GalleryController::class)->except(['index', 'show']);
    });

    Route::middleware(['role:ADMIN'])->group(function () {
        Route::get('audit-logs', [AuditLogController::class, 'index']);
        Route::get('stats', [AdminDashboardController::class, 'stats']);
    });

    // Student portal routes (role: STUDENT, ADMIN)
    Route::middleware(['role:STUDENT,ADMIN'])->prefix('student')->group(function () {
        Route::get('stats', [DashboardController::class, 'stats']);
        Route::get('units', [UnitController::class, 'index']);
        Route::get('assessments', [AssessmentController::class, 'index']);
        Route::post('assessments/submit', [AssessmentController::class, 'submit']);
        Route::get('attendance', [AttendanceController::class, 'index']);
        Route::get('results', [ResultController::class, 'index']);
        Route::get('fees', [FeeController::class, 'index']);
        Route::get('payments', [FeeController::class, 'payments']);
        Route::post('payments/initiate', [FeeController::class, 'initiatePayment']);
        Route::get('exam-card', [ExamCardController::class, 'show']);
        Route::get('library', [LibraryController::class, 'index']);
        Route::post('library/borrow', [LibraryController::class, 'borrow']);
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::patch('notifications/read', [NotificationController::class, 'markRead']);
        Route::get('messages', [MessageController::class, 'index']);
        Route::post('messages', [MessageController::class, 'store']);
        Route::get('announcements', [DashboardController::class, 'announcements']);
        Route::get('profile', [DashboardController::class, 'profile']);
        Route::patch('profile', [DashboardController::class, 'updateProfile']);
    });
});
```

---

## Key Migrations (UUID + PostgreSQL)

### Users Table
```php
Schema::create('users', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('email')->unique();
    $table->string('email_normalized')->unique();
    $table->string('name');
    $table->string('password_hash')->nullable();
    $table->string('image')->nullable();
    $table->string('phone')->nullable();
    $table->enum('role', ['ADMIN', 'EDITOR', 'STUDENT'])->default('STUDENT');
    $table->enum('status', ['ACTIVE', 'SUSPENDED', 'PENDING'])->default('ACTIVE');
    $table->timestamp('email_verified_at')->nullable();
    $table->timestamp('last_login_at')->nullable();
    $table->string('last_login_ip')->nullable();
    $table->integer('failed_login_attempts')->default(0);
    $table->timestamp('locked_until')->nullable();
    $table->boolean('two_factor_enabled')->default(false);
    $table->string('two_factor_secret')->nullable();
    $table->rememberToken();
    $table->timestamps();
    $table->softDeletes();

    $table->index(['role', 'status']);
});
```

### Students Table
```php
Schema::create('students', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('user_id');
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    $table->string('admission_no')->unique();
    $table->uuid('programme_id')->nullable();
    $table->foreign('programme_id')->references('id')->on('programmes')->onDelete('set null');
    $table->integer('year')->default(1);
    $table->integer('semester')->default(1);
    $table->enum('status', ['ACTIVE', 'SUSPENDED', 'GRADUATED', 'ON_LEAVE'])->default('ACTIVE');
    $table->timestamp('enrollment_date')->useCurrent();
    $table->enum('gender', ['MALE', 'FEMALE', 'OTHER'])->nullable();
    $table->date('date_of_birth')->nullable();
    $table->string('nationality')->nullable();
    $table->string('id_number')->nullable();
    $table->string('phone')->nullable();
    $table->text('address')->nullable();
    $table->string('next_of_kin')->nullable();
    $table->string('next_of_kin_phone')->nullable();
    $table->string('profile_image_url')->nullable();
    $table->integer('profile_complete')->default(40);
    $table->decimal('current_gpa', 3, 2)->default(0);
    $table->decimal('attendance_rate', 5, 2)->default(0);
    $table->integer('overall_progress')->default(0);
    $table->timestamps();

    $table->index(['programme_id', 'status']);
});
```

*(All other migrations follow the same UUID + foreign key + index pattern. See the Prisma schema at `prisma/schema.prisma` for the complete data model — the Laravel migrations mirror it 1:1.)*

---

## Sanctum Configuration

```php
// config/sanctum.php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:3000',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
    'expiration' => 60 * 24 * 30, // 30 days
    'token_prefix' => 'ng_',
];
```

---

## Redis Configuration

```env
# .env
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

```php
// config/cache.php — Redis stores
'redis' => [
    'client' => env('REDIS_CLIENT', 'phpredis'),
    'options' => [
        'cluster' => env('REDIS_CLUSTER', 'redis'),
        'prefix' => env('REDIS_PREFIX', 'northgate_'),
    ],
    'default' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_DB', '0'),
    ],
    'cache' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_CACHE_DB', '1'),
    ],
    'sessions' => [
        'database' => env('REDIS_SESSION_DB', '2'),
    ],
    'queue' => [
        'database' => env('REDIS_QUEUE_DB', '3'),
    ],
],
```

---

## File Storage (S3 + Cloudinary)

```php
// config/filesystems.php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app/private'),
        'throw' => false,
    ],
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
        'throw' => false,
    ],
    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'),
        'endpoint' => env('AWS_ENDPOINT'),
        'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
        'throw' => false,
    ],
    'cloudinary' => [
        'driver' => 'cloudinary',
        'key' => env('CLOUDINARY_API_KEY'),
        'secret' => env('CLOUDINARY_API_SECRET'),
        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    ],
],

// Default: local in dev, s3 in production
'default' => env('FILESYSTEM_DISK', env('APP_ENV') === 'production' ? 's3' : 'local'),
```

### FileUploadService
```php
<?php
namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    public function upload(UploadedFile $file, string $directory = 'uploads'): string
    {
        $disk = config('filesystems.default');
        $path = $file->store($directory, $disk);
        return Storage::disk($disk)->url($path);
    }

    public function uploadToCloudinary(UploadedFile $file, string $folder = 'northgate'): string
    {
        // Requires cloudinary-laravel package
        return \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::upload(
            $file->getRealPath(),
            ['folder' => $folder]
        )->getSecurePath();
    }

    public function delete(string $path): bool
    {
        $disk = config('filesystems.default');
        return Storage::disk($disk)->delete($path);
    }
}
```

---

## Repository Pattern Example

```php
<?php
// app/Repositories/Contracts/StudentRepositoryInterface.php
namespace App\Repositories\Contracts;

interface StudentRepositoryInterface
{
    public function findByUserId(string $userId): ?object;
    public function findOrFail(string $id): object;
    public function create(array $data): object;
    public function update(string $id, array $data): object;
    public function getStats(string $studentId): array;
    public function getAttendanceByUnit(string $studentId): array;
    public function getGpaTrend(string $studentId): array;
}

// app/Repositories/StudentRepository.php
namespace App\Repositories;

use App\Models\Student;
use App\Repositories\Contracts\StudentRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class StudentRepository implements StudentRepositoryInterface
{
    public function findByUserId(string $userId): ?object
    {
        return Cache::remember("student:user:{$userId}", 300, function () use ($userId) {
            return Student::with(['programme', 'user'])->where('user_id', $userId)->first();
        });
    }

    public function getStats(string $studentId): array
    {
        return Cache::remember("student:stats:{$studentId}", 60, function () use ($studentId) {
            $student = Student::findOrFail($studentId);
            return [
                'enrolled_units' => $student->enrollments()->where('status', 'ENROLLED')->count(),
                'pending_assessments' => $this->countPendingAssessments($studentId),
                'fee_balance' => $this->calculateFeeBalance($studentId),
                'exam_card_status' => $student->examCards()->latest()->value('status') ?? 'NONE',
                // ... all other stats
            ];
        });
    }

    // ... other methods
}
```

---

## Service Layer Example

```php
<?php
// app/Services/AuthService.php
namespace App\Services;

use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Sanctum\NewAccessToken;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $users
    ) {}

    public function login(string $email, string $password, string $ip = null): array
    {
        $user = $this->users->findByEmail(strtolower($email));

        if (!$user || !Hash::check($password, $user->password_hash)) {
            $this->incrementFailedAttempts($user?->id);
            throw new \Exception('Invalid email or password', 401);
        }

        if ($user->locked_until && $user->locked_until > now()) {
            throw new \Exception('Account temporarily locked', 423);
        }

        if ($user->status !== 'ACTIVE') {
            throw new \Exception("Account is {$user->status}", 403);
        }

        // Reset failed attempts
        $this->users->update($user->id, [
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => now(),
            'last_login_ip' => $ip,
        ]);

        // Create Sanctum token
        $token = $user->createToken('auth-token', ['*'], now()->addDays(30));

        return [
            'user' => $user,
            'token' => $token->plainTextToken,
        ];
    }

    private function incrementFailedAttempts(?string $userId): void
    {
        if (!$userId) return;
        $user = $this->users->find($userId);
        $attempts = $user->failed_login_attempts + 1;
        $this->users->update($userId, [
            'failed_login_attempts' => $attempts,
            'locked_until' => $attempts >= 5 ? now()->addMinutes(15) : null,
        ]);
    }
}
```

---

## .env.example (Laravel Backend)

```env
APP_NAME="Northgate Institute of Technology"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

# Database (PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=northgate
DB_USERNAME=postgres
DB_PASSWORD=

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# Mail (SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@northgate.ac.ke
MAIL_FROM_NAME="${APP_NAME}"

# File Storage
FILESYSTEM_DISK=local  # Change to 's3' in production
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Payment Gateways
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# Sanctum
SANCTUM_TOKEN_EXPIRATION=2592000  # 30 days in seconds
```

---

## Setup Commands

```bash
# 1. Create Laravel project
composer create-project laravel/laravel northgate-backend "12.*"
cd northgate-backend

# 2. Install dependencies
composer require laravel/sanctum
composer require cloudinary-labs/cloudinary-laravel
composer require league/flysystem-aws-s3-v3 "^3.0"
composer require predis/predis  # Redis client

# 3. Configure environment
cp .env.example .env
php artisan key:generate

# 4. Run migrations + seeders
php artisan migrate
php artisan db:seed

# 5. Start the server
php artisan serve --port=8000

# 6. Start the queue worker (in another terminal)
php artisan queue:work redis --tries=3

# 7. Run tests
php artisan test
```

---

## Frontend Connection

Once the Laravel backend is running, set this in the Next.js `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The frontend API client (`src/lib/api-client.ts`) will automatically:
1. Detect `NEXT_PUBLIC_API_URL` is set
2. Switch from Next.js API routes to Laravel API
3. Send `Authorization: Bearer <token>` header (Sanctum)
4. Store the token in `localStorage` after login

**No frontend code changes needed** — the API contract is identical between the Next.js routes and the Laravel backend.
