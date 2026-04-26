@extends('errors.layout')

@section('title', '401 Unauthorized')
@section('code', '401 · Unauthorized')
@section('heading', 'Authentication Required')
@section('message', 'You need to be signed in to view this page. Please log in to continue.')

@section('icon')
<style>
    @keyframes keyFloat {
        0%,100% { transform: translateY(0) rotate(-15deg); }
        50%      { transform: translateY(-9px) rotate(-15deg); }
    }
    @keyframes keyShimmer {
        0%   { stop-color: #FF9545; }
        50%  { stop-color: #ffb574; }
        100% { stop-color: #FF9545; }
    }
    @keyframes starSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    @keyframes glowKey {
        0%,100% { filter: drop-shadow(0 0 4px rgba(255,149,69,0.4)); }
        50%      { filter: drop-shadow(0 0 14px rgba(255,149,69,0.8)); }
    }
    @keyframes ringExpand {
        0%   { r: 20; opacity: 0.8; }
        100% { r: 52; opacity: 0; }
    }

    .key-group  { animation: keyFloat 2.4s ease-in-out infinite, glowKey 2.4s ease-in-out infinite; transform-origin: 65px 65px; }
    .star-orbit { animation: starSpin 6s linear infinite; transform-origin: 65px 65px; }
    .ring-exp   { animation: ringExpand 2.4s ease-out infinite; transform-origin: 65px 72px; }
</style>
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="keyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FF9545"/>
            <stop offset="100%" stop-color="#ffce99"/>
        </linearGradient>
    </defs>

    <circle cx="65" cy="65" r="56" fill="#FFEBF2" opacity="0.7"/>

    <!-- Expanding ring -->
    <circle class="ring-exp" cx="65" cy="72" r="20" stroke="#FF9545" stroke-width="2" fill="none"/>

    <!-- Orbiting star -->
    <g class="star-orbit">
        <circle cx="65" cy="22" r="4.5" fill="#E11D6D"/>
        <circle cx="108" cy="65" r="3" fill="#FF9545"/>
        <circle cx="65" cy="108" r="4.5" fill="#E11D6D" opacity="0.4"/>
        <circle cx="22" cy="65" r="3" fill="#FF9545" opacity="0.5"/>
    </g>

    <!-- Key -->
    <g class="key-group">
        <!-- Key head ring -->
        <circle cx="55" cy="55" r="18" fill="url(#keyGrad)" stroke="#d47a2f" stroke-width="2"/>
        <!-- Key head inner hole -->
        <circle cx="55" cy="55" r="9" fill="white"/>
        <circle cx="55" cy="55" r="5" fill="#FFEBF2"/>
        <!-- Key shaft -->
        <rect x="69" y="52" width="36" height="7" rx="3.5" fill="url(#keyGrad)"/>
        <!-- Key teeth -->
        <rect x="88" y="59" width="6" height="8" rx="2" fill="#FF9545"/>
        <rect x="98" y="59" width="5" height="6" rx="2" fill="#FF9545"/>
        <!-- Shine on head -->
        <circle cx="49" cy="49" r="4" fill="white" opacity="0.4"/>
    </g>
</svg>
@endsection

@section('actions')
    <a href="{{ route('login') }}" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Sign In
    </a>
    <a href="/" class="btn btn-ghost">Go Home</a>
@endsection
