@extends('errors.layout')

@section('title', '404 Not Found')
@section('code', '404 · Not Found')
@section('heading', 'Page Not Found')
@section('message', 'The page you\'re looking for doesn\'t exist or has been moved. Check the URL or head back home.')

@section('icon')
<style>
    /* Magnifying glass bob */
    @keyframes glassBob {
        0%, 100% { transform: translateY(0) rotate(-8deg); }
        50%       { transform: translateY(-10px) rotate(-8deg); }
    }
    /* Stars twinkle */
    @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50%       { opacity: 1; transform: scale(1.2); }
    }
    /* Orbit ring spin */
    @keyframes orbitSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    /* Dot on orbit */
    @keyframes dotPop {
        0%, 100% { r: 4; }
        50%       { r: 6; }
    }

    .glass-group { animation: glassBob 2.8s ease-in-out infinite; transform-origin: center; }
    .star-1 { animation: twinkle 1.6s ease-in-out infinite 0.0s; }
    .star-2 { animation: twinkle 1.6s ease-in-out infinite 0.5s; }
    .star-3 { animation: twinkle 1.6s ease-in-out infinite 1.0s; }
    .orbit-ring { animation: orbitSpin 4s linear infinite; transform-origin: 60px 60px; }
</style>
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Background glow circle -->
    <circle cx="65" cy="65" r="56" fill="#FFEBF2" opacity="0.7"/>

    <!-- Stars -->
    <circle class="star-1" cx="22" cy="30" r="3" fill="#FF9545"/>
    <circle class="star-2" cx="106" cy="24" r="2" fill="#E11D6D"/>
    <circle class="star-3" cx="112" cy="90" r="3" fill="#FF9545"/>
    <circle class="star-1" cx="18" cy="95" r="2" fill="#F87BB4"/>

    <!-- Orbit ring with dot -->
    <g class="orbit-ring">
        <circle cx="65" cy="65" r="42" stroke="#F87BB4" stroke-width="1.5" stroke-dasharray="5 6" fill="none" opacity="0.5"/>
        <circle cx="65" cy="23" r="5" fill="#E11D6D"/>
    </g>

    <!-- Magnifying glass -->
    <g class="glass-group">
        <!-- Handle -->
        <line x1="82" y1="82" x2="96" y2="96" stroke="#1A111A" stroke-width="8" stroke-linecap="round"/>
        <!-- Lens outer -->
        <circle cx="62" cy="62" r="26" fill="white" stroke="#E11D6D" stroke-width="5"/>
        <!-- Lens inner tint -->
        <circle cx="62" cy="62" r="20" fill="#FFEBF2"/>
        <!-- Question mark -->
        <text x="62" y="70" text-anchor="middle" font-size="22" font-weight="800"
              font-family="Georgia,serif" fill="#E11D6D">?</text>
        <!-- Lens shine -->
        <circle cx="53" cy="52" r="5" fill="white" opacity="0.6"/>
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
