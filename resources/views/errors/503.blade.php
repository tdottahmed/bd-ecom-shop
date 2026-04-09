@extends('errors.layout')

@section('title', '503 Service Unavailable')
@section('code', '503 · Maintenance')
@section('heading', 'We\'ll Be Right Back')
@section('message', 'We\'re performing scheduled maintenance to improve your experience. Please check back in a few minutes.')

@section('icon')
<style>
    @keyframes wrenchSwing {
        0%,100% { transform: rotate(-20deg); }
        50%      { transform: rotate(20deg); }
    }
    @keyframes barPulse {
        0%,100% { width: 40px; opacity: 0.4; }
        50%      { width: 56px; opacity: 1; }
    }
    @keyframes barPulse2 {
        0%,100% { width: 52px; opacity: 0.5; }
        50%      { width: 36px; opacity: 1; }
    }
    @keyframes dotBlink {
        0%,100% { opacity: 0.2; transform: scale(0.7); }
        50%      { opacity: 1; transform: scale(1); }
    }

    .wrench-g { animation: wrenchSwing 1.8s ease-in-out infinite; transform-origin: 68px 70px; }
    .dot-1 { animation: dotBlink 1.4s ease-in-out infinite 0.0s; }
    .dot-2 { animation: dotBlink 1.4s ease-in-out infinite 0.45s; }
    .dot-3 { animation: dotBlink 1.4s ease-in-out infinite 0.90s; }
</style>
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="65" cy="65" r="56" fill="#FFEBF2" opacity="0.7"/>

    <!-- Hard hat -->
    <path d="M40 68 Q40 44 65 44 Q90 44 90 68 Z" fill="#FF9545"/>
    <rect x="36" y="67" width="58" height="8" rx="4" fill="#E11D6D"/>
    <!-- Hat brim shadow -->
    <rect x="36" y="72" width="58" height="2" rx="1" fill="#c4155c" opacity="0.4"/>
    <!-- Hat stripe -->
    <rect x="62" y="44" width="6" height="24" rx="3" fill="white" opacity="0.35"/>

    <!-- Wrench -->
    <g class="wrench-g">
        <!-- Handle -->
        <rect x="61" y="68" width="14" height="44" rx="7" fill="#1A111A"/>
        <!-- Head -->
        <path d="M55 64 Q55 52 68 52 Q81 52 81 64 Q81 70 75 72 L61 72 Q55 70 55 64Z" fill="#1A111A"/>
        <!-- Head slot -->
        <rect x="62" y="58" width="12" height="8" rx="3" fill="#FFEBF2"/>
    </g>

    <!-- Animated progress dots -->
    <circle class="dot-1" cx="50" cy="118" r="5" fill="#E11D6D"/>
    <circle class="dot-2" cx="65" cy="118" r="5" fill="#E11D6D"/>
    <circle class="dot-3" cx="80" cy="118" r="5" fill="#E11D6D"/>
</svg>
@endsection

@section('actions')
    <a href="javascript:location.reload()" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Refresh Page
    </a>
    <a href="mailto:{{ config('mail.from.address') }}" class="btn btn-ghost">Contact Support</a>
@endsection
