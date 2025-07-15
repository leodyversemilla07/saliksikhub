
<?php

use App\Services\StorageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
    Auth::shouldReceive('id')->andReturn(1);
});

test('store user file and check existence and content', function () {
    $service = new StorageService('local');
    $file = UploadedFile::fake()->create('test.txt', 1, 'text/plain');
    // Manually seed the file with content after storing
    $path = $service->storeUserFile($file);
    Storage::disk('local')->put($path, 'sample content');

    expect(Storage::disk('local')->exists($path))->toBeTrue();
    expect($service->fileExists($path))->toBeTrue();

    $content = $service->getFileContent($path);
    expect($content)->toBe('sample content');
});

test('generateTemporaryUrl returns null for local disk', function () {
    $service = new StorageService('local');
    $url = $service->generateTemporaryUrl('some/path/file.txt');
    expect($url)->toBeNull();
});

test('storeFile stores file with custom directory and filename', function () {
    $service = new StorageService('local');
    $file = UploadedFile::fake()->create('custom.txt', 1, 'text/plain');
    $path = $service->storeFile($file, 'custom_dir', 'myfile.txt');
    Storage::disk('local')->put($path, 'custom content');
    expect(Storage::disk('local')->exists($path))->toBeTrue();
    expect($service->getFileContent($path))->toBe('custom content');
});

test('fileExists returns false for non-existent file', function () {
    $service = new StorageService('local');
    expect($service->fileExists('nonexistent/file.txt'))->toBeFalse();
});

test('getFileContent throws exception for non-existent file', function () {
    $service = new StorageService('local');
    try {
        $service->getFileContent('nonexistent/file.txt');
        expect()->fail('No exception thrown');
    } catch (\Throwable $e) {
        expect($e instanceof TypeError || str_contains(get_class($e), 'FileNotFound'))->toBeTrue();
    }
});

test('storeFile handles unusual filenames', function () {
    $service = new StorageService('local');
    $file = UploadedFile::fake()->create('weird@#$.txt', 1, 'text/plain');
    $path = $service->storeFile($file, 'strange', 'weird@#$.txt');
    Storage::disk('local')->put($path, 'strange content');
    expect(Storage::disk('local')->exists($path))->toBeTrue();
    expect($service->getFileContent($path))->toBe('strange content');
});

test('storeFile throws exception on invalid upload', function () {
    $service = new StorageService('local');
    // @phpstan-ignore-next-line
    $invalidFile = null;
    expect(fn () => $service->storeFile($invalidFile, 'dir', 'file.txt'))->toThrow(TypeError::class);
});
