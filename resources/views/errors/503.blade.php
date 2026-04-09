@extends('errors.layout')

@section('title', '503 Service Unavailable')
@section('code', '503 · Maintenance')
@section('heading', 'We\'ll Be Right Back')
@section('message', 'We\'re currently performing scheduled maintenance to improve your experience. Please check back in a few minutes.')

@section('actions')
    <a href="javascript:location.reload()" class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Refresh Page
    </a>
    <a href="mailto:{{ config('mail.from.address') }}" class="btn btn-ghost">Contact Support</a>
@endsection
