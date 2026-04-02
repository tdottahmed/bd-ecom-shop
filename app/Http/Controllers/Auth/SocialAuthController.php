<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    private const SUPPORTED_PROVIDERS = ['google', 'facebook'];

    public function redirect(string $provider)
    {
        $this->validateProvider($provider);
        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider)
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception) {
            return redirect()->route('login')->withErrors(['social' => 'Social login failed. Please try again.']);
        }

        $user = User::where('social_provider', $provider)
            ->where('social_id', $socialUser->getId())
            ->first();

        if (! $user) {
            $user = User::where('email', $socialUser->getEmail())->first();

            if ($user) {
                $user->update([
                    'social_id'       => $socialUser->getId(),
                    'social_provider' => $provider,
                ]);
            } else {
                $user = User::create([
                    'name'              => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                    'email'             => $socialUser->getEmail(),
                    'social_id'         => $socialUser->getId(),
                    'social_provider'   => $provider,
                    'password'          => bcrypt(str()->random(24)),
                    'email_verified_at' => now(),
                ]);
            }
        }

        Auth::login($user, remember: true);

        return redirect()->intended('/');
    }

    private function validateProvider(string $provider): void
    {
        if (! in_array($provider, self::SUPPORTED_PROVIDERS)) {
            abort(404);
        }
    }
}
