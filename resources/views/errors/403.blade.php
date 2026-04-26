@extends('errors.layout')

@section('title', '403 Forbidden')
@section('code', '403 · Forbidden')
@section('heading', 'Access Denied')
@section('message', 'You don\'t have permission to view this page. If you believe this is a mistake, please contact support.')

@section('icon')
<style>
    @keyframes lockShake {
        0%,100% { transform: rotate(0deg); }
        15%      { transform: rotate(-8deg); }
        30%      { transform: rotate(8deg); }
        45%      { transform: rotate(-5deg); }
        60%      { transform: rotate(5deg); }
        75%      { transform: rotate(-2deg); }
        90%      { transform: rotate(2deg); }
    }
    @keyframes shieldPulse {
        0%,100% { transform: scale(1); filter: drop-shadow(0 0 0px #E11D6D); }
        50%      { transform: scale(1.05); filter: drop-shadow(0 0 12px rgba(225,29,109,0.5)); }
    }
    @keyframes keyholePop {
        0%,80%,100% { transform: scaleY(1); }
        90%          { transform: scaleY(1.15); }
    }
    @keyframes ringPing {
        0%   { r: 38; opacity: 0.6; }
        100% { r: 58; opacity: 0; }
    }

    .lock-group  { animation: lockShake 3.5s ease-in-out infinite; transform-origin: 65px 70px; }
    .shield-base { animation: shieldPulse 2.5s ease-in-out infinite; transform-origin: 65px 65px; }
    .ring-ping   { animation: ringPing 2.5s ease-out infinite; transform-origin: 65px 65px; }
</style>
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="65" cy="65" r="56" fill="#FFEBF2" opacity="0.7"/>

    <!-- Ping ring -->
    <circle class="ring-ping" cx="65" cy="65" r="38" stroke="#E11D6D" stroke-width="2" fill="none" opacity="0.5"/>

    <g class="lock-group">
        <!-- Shackle (arch) -->
        <path d="M48 66 L48 50 Q48 36 65 36 Q82 36 82 50 L82 66" stroke="#1A111A" stroke-width="7" stroke-linecap="round" fill="none"/>
        <!-- Lock body -->
        <rect x="42" y="64" width="46" height="36" rx="10" fill="#E11D6D"/>
        <!-- Keyhole circle -->
        <circle cx="65" cy="80" r="7" fill="white" opacity="0.9"/>
        <!-- Keyhole slot -->
        <rect x="62" y="80" width="6" height="10" rx="3" fill="white" opacity="0.9"/>
        <!-- Shine -->
        <ellipse cx="52" cy="72" rx="4" ry="3" fill="white" opacity="0.2" transform="rotate(-20 52 72)"/>
    </g>
</svg>
@endsection

@section('actions')
    <a href="/" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Go Home
    </a>
    <a href="javascript:history.back()" class="btn btn-ghost">Go Back</a>
@endsection
