@extends('errors.layout')

@section('title', '419 Page Expired')
@section('code', '419 · Page Expired')
@section('heading', 'Your Session Has Expired')
@section('message', 'The page token has expired due to inactivity. Please go back and try submitting the form again.')

@section('actions')
    <a href="javascript:history.back()" class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Go Back
    </a>
    <a href="/" class="btn btn-ghost">Go Home</a>
@endsection
