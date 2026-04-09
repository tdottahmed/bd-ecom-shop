@extends('errors.layout')

@section('title', '401 Unauthorized')
@section('code', '401 · Unauthorized')
@section('heading', 'Authentication Required')
@section('message', 'You need to be logged in to view this page. Please sign in to continue.')

@section('actions')
    <a href="{{ route('login') }}" class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Sign In
    </a>
    <a href="/" class="btn btn-ghost">Go Home</a>
@endsection
