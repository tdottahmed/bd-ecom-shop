@extends('errors.layout')

@section('title', '500 Server Error')
@section('code', '500 · Server Error')
@section('heading', 'Something Went Wrong')
@section('message', 'An unexpected error occurred on our end. Our team has been notified and we\'re working on a fix. Please try again shortly.')

@section('actions')
    <a href="/" class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Go Home
    </a>
    <a href="javascript:location.reload()" class="btn btn-ghost">Try Again</a>
@endsection
