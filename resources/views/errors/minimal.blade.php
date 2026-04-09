@extends('errors.layout')

@section('title', $exception->getStatusCode() . ' Error')
@section('code', $exception->getStatusCode() . ' · Error')
@section('heading', 'Oops! Something Went Wrong')
@section('message', $exception->getMessage() ?: 'An unexpected error occurred. Please try again or contact support if the problem persists.')

@section('actions')
    <a href="/" class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Go Home
    </a>
    <a href="javascript:history.back()" class="btn btn-ghost">Go Back</a>
@endsection
