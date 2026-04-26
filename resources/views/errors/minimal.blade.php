@extends('errors.layout')

@section('title', $exception->getStatusCode() . ' Error')
@section('code', $exception->getStatusCode() . ' · Error')
@section('heading', 'Oops! Something Went Wrong')
@section('message', $exception->getMessage() ?: 'An unexpected error occurred. Please try again or contact support if the problem persists.')

@section('icon')
<style>
    @keyframes trianglePulse {
        0%,100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(225,29,109,0.3)); }
        50%      { transform: scale(1.07); filter: drop-shadow(0 0 16px rgba(225,29,109,0.6)); }
    }
    @keyframes bangBlink {
        0%,100% { opacity: 1; }
        50%      { opacity: 0.3; }
    }
    @keyframes circleOrbit {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }

    .tri-group  { animation: trianglePulse 2.2s ease-in-out infinite; transform-origin: 65px 65px; }
    .bang       { animation: bangBlink 1.1s ease-in-out infinite; }
    .orbit-dots { animation: circleOrbit 5s linear infinite; transform-origin: 65px 65px; }
</style>
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="65" cy="65" r="56" fill="#FFEBF2" opacity="0.7"/>

    <!-- Orbiting dots -->
    <g class="orbit-dots">
        <circle cx="65" cy="18" r="4.5" fill="#E11D6D"/>
        <circle cx="112" cy="65" r="3.5" fill="#FF9545"/>
        <circle cx="65" cy="112" r="4.5" fill="#E11D6D" opacity="0.4"/>
        <circle cx="18" cy="65" r="3.5" fill="#FF9545" opacity="0.5"/>
    </g>

    <g class="tri-group">
        <!-- Warning triangle shadow -->
        <polygon points="65,26 108,98 22,98" fill="#F87BB4" opacity="0.3" transform="translate(3,4)"/>
        <!-- Warning triangle -->
        <polygon points="65,26 108,98 22,98" fill="#E11D6D"/>
        <!-- Inner lighter triangle -->
        <polygon points="65,36 100,92 30,92" fill="#c4155c" opacity="0.3"/>
        <!-- Exclamation bar -->
        <rect class="bang" x="61" y="52" width="8" height="26" rx="4" fill="white"/>
        <!-- Exclamation dot -->
        <circle cx="65" cy="86" r="5" fill="white"/>
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
