<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KelasController;
use Illuminate\Support\Facades\Route;

// ============ PUBLIC ROUTES ============
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ============ PROTECTED ROUTES ============
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// ============ ROUTES DENGAN ROLE ============
Route::middleware(['auth:sanctum', 'role:guru'])->group(function () {
    Route::get('/guru/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'Anda adalah guru!'
        ]);
    });
});

Route::middleware(['auth:sanctum', 'role:bendahara'])->group(function () {
    Route::get('/bendahara/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'Anda adalah bendahara!'
        ]);
    });
});

Route::middleware(['auth:sanctum', 'role:siswa'])->group(function () {
    Route::get('/siswa/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'Anda adalah siswa!'
        ]);
    });
});

// ============ MULTI ROLE ============
Route::middleware(['auth:sanctum', 'role:guru,bendahara'])->group(function () {
    Route::get('/guru-bendahara/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'Anda adalah guru atau bendahara!'
        ]);
    });
});

// Boleh diakses oleh guru dan bendahara (untuk lihat)
Route::middleware(['auth:sanctum', 'role:guru,bendahara'])->group(function () {
    Route::get('/kelas', [KelasController::class, 'index']);
    Route::get('/kelas/{id}', [KelasController::class, 'show']);
    Route::get('/kelas/{id}/siswa', [KelasController::class, 'getSiswa']);
});

// Hanya guru yang boleh create, update, delete
Route::middleware(['auth:sanctum', 'role:guru'])->group(function () {
    Route::post('/kelas', [KelasController::class, 'store']);
    Route::put('/kelas/{id}', [KelasController::class, 'update']);
    Route::delete('/kelas/{id}', [KelasController::class, 'destroy']);
});