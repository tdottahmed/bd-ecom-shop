<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class UnescapedJson implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        if (is_null($value)) {
            return [];
        }

        return is_string($value) ? json_decode($value, true) ?? [] : $value;
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return json_encode($value, JSON_UNESCAPED_SLASHES);
    }
}
