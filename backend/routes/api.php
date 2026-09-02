<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IuranController;
use App\Http\Controllers\Api\KelasController;
use App\Http\Controllers\Api\SiswaController;
use App\Http\Controllers\Api\TransaksiController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

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

Route::middleware(['auth:sanctum', 'role:guru,bendahara'])->group(function () {
    Route::get('/guru-bendahara/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'Anda adalah guru atau bendahara!'
        ]);
    });
});

Route::middleware(['auth:sanctum', 'role:guru,bendahara'])->group(function () {
    Route::get('/kelas', [KelasController::class, 'index']);
    Route::get('/kelas/{id}', [KelasController::class, 'show']);
    Route::get('/kelas/{id}/siswa', [KelasController::class, 'getSiswa']);
});

Route::middleware(['auth:sanctum', 'role:guru'])->group(function () {
    Route::post('/kelas', [KelasController::class, 'store']);
    Route::put('/kelas/{id}', [KelasController::class, 'update']);
    Route::delete('/kelas/{id}', [KelasController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:guru,bendahara'])->group(function () {
    Route::get('/siswa', [SiswaController::class, 'index']);
    Route::get('/siswa/{id}', [SiswaController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'role:guru'])->group(function () {
    Route::post('/siswa', [SiswaController::class, 'store']);
    Route::put('/siswa/{id}', [SiswaController::class, 'update']);
    Route::delete('/siswa/{id}', [SiswaController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:guru,bendahara,siswa'])->group(function () {
    Route::get('/iuran', [IuranController::class, 'index']);
    Route::get('/iuran/{id}', [IuranController::class, 'show']);
    Route::get('/iuran/kelas/{kelas_id}', [IuranController::class, 'getByKelas']);
    Route::get('/iuran/{id}/siswa', [IuranController::class, 'getStatusSiswa']);
});

Route::middleware(['auth:sanctum', 'role:guru'])->group(function () {
    Route::post('/iuran', [IuranController::class, 'store']);
    Route::put('/iuran/{id}', [IuranController::class, 'update']);
    Route::delete('/iuran/{id}', [IuranController::class, 'destroy']);
});

// Transaksi pending (bisa dilihat guru & bendahara)
Route::middleware(['auth:sanctum', 'role:guru,bendahara'])->group(function () {
    Route::get('/transaksi/pending', [TransaksiController::class, 'getPending']);
});

// Semua role bisa lihat transaksi (dengan batasan)
Route::middleware(['auth:sanctum'])->group(function () {
    // Siswa bisa lihat transaksinya sendiri
    Route::get('/transaksi/saya', [TransaksiController::class, 'getMyTransaksi']);
});

// Guru & bendahara bisa lihat semua transaksi
Route::middleware(['auth:sanctum', 'role:guru,bendahara'])->group(function () {
    Route::get('/transaksi', [TransaksiController::class, 'index']);
    Route::get('/transaksi/{id}', [TransaksiController::class, 'show']);
    Route::get('/transaksi/siswa/{siswa_id}', [TransaksiController::class, 'getBySiswa']);
    Route::get('/transaksi/iuran/{iuran_id}', [TransaksiController::class, 'getByIuran']);
});

// Hanya guru yang boleh delete transaksi
Route::middleware(['auth:sanctum', 'role:guru'])->group(function () {
    Route::delete('/transaksi/{id}', [TransaksiController::class, 'destroy']);
});

// Siswa & bendahara bisa membuat transaksi (bayar)
Route::middleware(['auth:sanctum', 'role:siswa,bendahara'])->group(function () {
    Route::post('/transaksi', [TransaksiController::class, 'store']);
});

// Guru & bendahara bisa update & konfirmasi transaksi
Route::middleware(['auth:sanctum', 'role:guru,bendahara'])->group(function () {
    Route::put('/transaksi/{id}', [TransaksiController::class, 'update']);
    Route::put('/transaksi/{id}/konfirmasi', [TransaksiController::class, 'konfirmasi']);
});