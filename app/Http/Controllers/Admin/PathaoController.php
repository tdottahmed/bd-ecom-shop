<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PathaoService;
use Illuminate\Http\JsonResponse;

class PathaoController extends Controller
{
    public function __construct(private PathaoService $pathao) {}

    public function cities(): JsonResponse
    {
        $cities = $this->pathao->getCities();
        return response()->json($cities);
    }

    public function zones(int $cityId): JsonResponse
    {
        $zones = $this->pathao->getZones($cityId);
        return response()->json($zones);
    }

    public function areas(int $zoneId): JsonResponse
    {
        $areas = $this->pathao->getAreas($zoneId);
        return response()->json($areas);
    }
}
