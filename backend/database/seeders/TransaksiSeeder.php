<?php

namespace Database\Seeders;

use App\Models\Iuran;
use App\Models\Siswa;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TransaksiSeeder extends Seeder
{
    public function run(): void
    {
        // Kosongkan tabel sebelum insert
        Schema::disableForeignKeyConstraints();
        DB::table('transaksis')->truncate();
        Schema::enableForeignKeyConstraints();

        // Ambil semua siswa
        $siswa = Siswa::with('user')->get();

        // Ambil user bendahara (untuk confirmed_by)
        $bendahara = User::where('role_id', 2)->first();

        if (!$bendahara) {
            $this->command->error('❌ Bendahara tidak ditemukan! Jalankan UserSeeder terlebih dahulu.');
            return;
        }

        // Ambil semua iuran yang sudah ada
        $iuranList = Iuran::all();

        if ($iuranList->isEmpty()) {
            $this->command->error('❌ Data iuran tidak ditemukan! Jalankan IuranSeeder terlebih dahulu.');
            return;
        }

        $transaksiData = [];

        // Untuk setiap siswa, buat beberapa transaksi (acak sudah bayar atau belum)
        foreach ($siswa as $s) {
            // Ambil 70% iuran yang dibayar (sisanya belum bayar)
            $iuranTerpilih = $iuranList->random(ceil($iuranList->count() * 0.7));

            foreach ($iuranTerpilih as $iuran) {
                // Random status: 80% confirmed, 20% pending
                $status = rand(1, 100) <= 80 ? 'confirmed' : 'pending';

                $transaksiData[] = [
                    'siswa_id' => $s->id,
                    'iuran_id' => $iuran->id,
                    'jumlah' => $iuran->nominal,
                    'tanggal_bayar' => now()->subDays(rand(1, 30)),
                    'metode' => collect(['tunai', 'transfer', 'qris'])->random(),
                    'bukti_bayar' => $status == 'pending' ? 'bukti_' . rand(1, 10) . '.jpg' : null,
                    'status' => $status,
                    'confirmed_by' => $status == 'confirmed' ? $bendahara->id : null,
                    'confirmed_at' => $status == 'confirmed' ? now()->subDays(rand(1, 10)) : null,
                    'keterangan' => null,
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now(),
                ];
            }
        }

        // Insert data
        foreach ($transaksiData as $data) {
            Transaksi::create($data);
        }

        $this->command->info('✅ ' . count($transaksiData) . ' data transaksi berhasil dibuat!');
    }
}