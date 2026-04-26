@extends('errors.layout')

@section('title', '419 Page Expired')
@section('code', '419 · Page Expired')
@section('heading', 'Your Session Has Expired')
@section('message', 'The page token has expired due to inactivity. Go back and try submitting the form again.')

@section('icon')
<style>
    @keyframes minuteSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    @keyframes hourSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    @keyframes clockPulse {
        0%,100% { transform: scale(1); }
        50%      { transform: scale(1.04); }
    }
    @keyframes sandFall {
        0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
        30%  { opacity: 1; }
        100% { transform: scaleY(1); transform-origin: top; opacity: 1; }
    }
    @keyframes glowRing {
        0%,100% { stroke-opacity: 0.3; }
        50%      { stroke-opacity: 0.9; }
    }

    .clock-group { animation: clockPulse 3s ease-in-out infinite; transform-origin: 65px 60px; }
    .minute-hand { animation: minuteSpin 4s linear infinite; transform-origin: 65px 60px; }
    .hour-hand   { animation: hourSpin 24s linear infinite; transform-origin: 65px 60px; }
    .glow-ring   { animation: glowRing 2s ease-in-out infinite; }
</style>
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="65" cy="65" r="56" fill="#FFEBF2" opacity="0.7"/>

    <!-- Glow ring -->
    <circle class="glow-ring" cx="65" cy="62" r="38" stroke="#E11D6D" stroke-width="2.5" fill="none"/>

    <g class="clock-group">
        <!-- Clock face -->
        <circle cx="65" cy="62" r="34" fill="white" stroke="#E11D6D" stroke-width="4"/>
        <!-- Inner face -->
        <circle cx="65" cy="62" r="28" fill="#FFEBF2" opacity="0.5"/>

        <!-- Hour ticks -->
        <line x1="65" y1="31" x2="65" y2="37" stroke="#E11D6D" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="65" y1="87" x2="65" y2="93" stroke="#E11D6D" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="31" y1="62" x2="37" y2="62" stroke="#E11D6D" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="93" y1="62" x2="99" y2="62" stroke="#E11D6D" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Hour hand -->
        <line class="hour-hand" x1="65" y1="62" x2="65" y2="46" stroke="#1A111A" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Minute hand -->
        <line class="minute-hand" x1="65" y1="62" x2="79" y2="62" stroke="#E11D6D" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Center dot -->
        <circle cx="65" cy="62" r="4" fill="#E11D6D"/>
        <circle cx="65" cy="62" r="2" fill="white"/>
    </g>

    <!-- Exclamation badge -->
    <circle cx="95" cy="30" r="13" fill="#FF9545"/>
    <text x="95" y="35" text-anchor="middle" font-size="16" font-weight="900" font-family="Georgia,serif" fill="white">!</text>
</svg>
@endsection

@section('actions')
    <a href="javascript:history.back()" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Go Back
    </a>
    <a href="/" class="btn btn-ghost">Go Home</a>
@endsection
