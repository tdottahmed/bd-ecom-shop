@extends('errors.layout')

@section('title', '500 Server Error')
@section('code', '500 · Server Error')
@section('heading', 'Something Went Wrong')
@section('message', 'An unexpected error occurred on our end. Our team has been notified and we\'re working on a fix. Please try again shortly.')

@section('icon')
<style>
    @keyframes gearSpin   { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
    @keyframes gearSpinRev{ from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
    @keyframes boltFlash  {
        0%, 100% { opacity: 1; filter: drop-shadow(0 0 0px #FF9545); }
        50%       { opacity: 0.5; filter: drop-shadow(0 0 8px #FF9545); }
    }
    @keyframes smokePuff  {
        0%   { transform: translateY(0) scale(1); opacity: 0.5; }
        100% { transform: translateY(-18px) scale(1.5); opacity: 0; }
    }

    .gear-big { animation: gearSpin 5s linear infinite; transform-origin: 52px 58px; }
    .gear-sm  { animation: gearSpinRev 3.5s linear infinite; transform-origin: 86px 40px; }
    .bolt     { animation: boltFlash 1.2s ease-in-out infinite; }
    .puff-1   { animation: smokePuff 2s ease-out infinite 0s; }
    .puff-2   { animation: smokePuff 2s ease-out infinite 0.7s; }
    .puff-3   { animation: smokePuff 2s ease-out infinite 1.4s; }
</style>
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- BG -->
    <circle cx="65" cy="65" r="56" fill="#FFEBF2" opacity="0.7"/>

    <!-- Smoke puffs -->
    <circle class="puff-1" cx="90" cy="28" r="5" fill="#c4155c" opacity="0.4"/>
    <circle class="puff-2" cx="98" cy="22" r="3.5" fill="#E11D6D" opacity="0.3"/>
    <circle class="puff-3" cx="83" cy="20" r="4" fill="#F87BB4" opacity="0.3"/>

    <!-- Big gear -->
    <g class="gear-big">
        <path d="M52 36c-1.1 0-2 .9-2 2v4.2c-1.9.5-3.7 1.4-5.3 2.5l-3.6-2.1c-1-.6-2.2-.2-2.8.7l-4 6.9c-.6 1-.2 2.2.7 2.8l3.6 2.1c-.3 1-.4 2-.4 3s.1 2 .4 3l-3.6 2.1c-1 .6-1.2 1.8-.7 2.8l4 6.9c.6 1 1.8 1.2 2.8.7l3.6-2.1c1.6 1.1 3.4 2 5.3 2.5V78c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-4.2c1.9-.5 3.7-1.4 5.3-2.5l3.6 2.1c1 .6 2.2.2 2.8-.7l4-6.9c.6-1 .2-2.2-.7-2.8l-3.6-2.1c.3-1 .4-2 .4-3s-.1-2-.4-3l3.6-2.1c1-.6 1.2-1.8.7-2.8l-4-6.9c-.6-1-1.8-1.2-2.8-.7l-3.6 2.1c-1.6-1.1-3.4-2-5.3-2.5V38c0-1.1-.9-2-2-2h-8z" fill="#E11D6D" opacity="0.9"/>
        <circle cx="56" cy="58" r="10" fill="white"/>
        <circle cx="56" cy="58" r="6" fill="#E11D6D" opacity="0.3"/>
    </g>

    <!-- Small gear -->
    <g class="gear-sm">
        <path d="M86 29c-.7 0-1.3.6-1.3 1.3v2.5c-1.1.3-2.2.8-3.1 1.5l-2.2-1.3c-.6-.3-1.3-.1-1.7.4l-2.4 4.2c-.3.6-.1 1.4.4 1.7l2.2 1.3c-.2.6-.3 1.2-.3 1.8s.1 1.2.3 1.8l-2.2 1.3c-.6.3-.8 1.1-.4 1.7l2.4 4.2c.3.6 1.1.8 1.7.4l2.2-1.3c.9.7 2 1.2 3.1 1.5v2.5c0 .7.6 1.3 1.3 1.3h4.7c.7 0 1.3-.6 1.3-1.3v-2.5c1.1-.3 2.2-.8 3.1-1.5l2.2 1.3c.6.3 1.3.1 1.7-.4l2.4-4.2c.3-.6.1-1.4-.4-1.7l-2.2-1.3c.2-.6.3-1.2.3-1.8s-.1-1.2-.3-1.8l2.2-1.3c.6-.3.8-1.1.4-1.7L99.1 33c-.3-.6-1.1-.8-1.7-.4l-2.2 1.3c-.9-.7-2-1.2-3.1-1.5v-2.5c0-.7-.6-1.3-1.3-1.3H86z" fill="#FF9545" opacity="0.85"/>
        <circle cx="88.3" cy="42.7" r="5.5" fill="white"/>
        <circle cx="88.3" cy="42.7" r="3" fill="#FF9545" opacity="0.35"/>
    </g>

    <!-- Lightning bolt -->
    <g class="bolt">
        <polygon points="68,78 62,95 72,91 66,110 80,89 69,93" fill="#FF9545"/>
        <polygon points="68,78 62,95 72,91 66,110 80,89 69,93" fill="none" stroke="white" stroke-width="1" opacity="0.4"/>
    </g>
</svg>
@endsection

@section('actions')
    <a href="/" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Go Home
    </a>
    <a href="javascript:location.reload()" class="btn btn-ghost">Try Again</a>
@endsection
