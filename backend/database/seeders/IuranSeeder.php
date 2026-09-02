<?php

namespace Database\Seeders;

use App\Models\Iuran;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class IuranSeeder extends Seeder
{
    public function run(): void
    {
        // Kosongkan tabel sebelum insert
        Schema::disableForeignKeyConstraints();
        DB::table('iurans')->truncate();
        Schema::enableForeignKeyConstraints();

        // Ambil data kelas
        $kelas = Kelas::all();

        // Ambil user guru (untuk created_by)
        $guru = User::where('role_id', 1)->first();

        if (!$guru) {
            $this->command->error('❌ Guru tidak ditemukan! Jalankan UserSeeder terlebih dahulu.');
            return;
        }

        // Data iuran per kelas (September 2025 - Juni 2026)
        $iuranData = [];

        // Bulan dan tahun
        $bulanData = [
            ['bulan' => 9, 'tahun' => 2025, 'jatuh_tempo' => '2025-09-10'],
            ['bulan' => 10, 'tahun' => 2025, 'jatuh_tempo' => '2025-10-10'],
            ['bulan' => 11, 'tahun' => 2025, 'jatuh_tempo' => '2025-11-10'],
            ['bulan' => 12, 'tahun' => 2025, 'jatuh_tempo' => '2025-12-10'],
            ['bulan' => 1, 'tahun' => 2026, 'jatuh_tempo' => '2026-01-10'],
            ['bulan' => 2, 'tahun' => 2026, 'jatuh_tempo' => '2026-02-10'],
            ['bulan' => 3, 'tahun' => 2026, 'jatuh_tempo' => '2026-03-10'],
            ['bulan' => 4, 'tahun' => 2026, 'jatuh_tempo' => '2026-04-10'],
            ['bulan' => 5, 'tahun' => 2026, 'jatuh_tempo' => '2026-05-10'],
            ['bulan' => 6, 'tahun' => 2026, 'jatuh_tempo' => '2026-06-10'],
        ];

        foreach ($kelas as $k) {
            foreach ($bulanData as $b) {
                $iuranData[] = [
                    'kelas_id' => $k->id,
                    'bulan' => $b['bulan'],
                    'tahun' => $b['tahun'],
                    'nominal' => 50000, // Iuran Rp 50.000
                    'jatuh_tempo' => $b['jatuh_tempo'],
                    'is_active' => true,
                    'created_by' => $guru->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Insert data
        foreach ($iuranData as $data) {
            Iuran::create($data);
        }

        $this->command->info('✅ ' . count($iuranData) . ' data iuran berhasil dibuat!');
    }
}