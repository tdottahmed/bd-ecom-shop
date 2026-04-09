@extends('errors.layout')

@section('title', '403 Forbidden')
@section('code', '403 · Forbidden')
@section('heading', 'Access Denied')
@section('message', 'You don\'t have permission to access this page. If you believe this is a mistake, please contact support.')

@section('actions')
    <a href="/" class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Go Home
    </a>
    <a href="javascript:history.back()" class="btn btn-ghost">Go Back</a>
@endsection
