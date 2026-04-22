@if(!empty($section['data']['rows']))
<section class="lp-section {{ $idx % 2 === 0 ? 'bg-white' : 'bg-soft' }}">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            @if(!empty($section['data']['title']))
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] }}</h2>
            @endif
        </div>
        <div class="comparison-wrap" data-gsap="fade-up" data-delay="0.1">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th class="comparison-feature-col"></th>
                        <th class="comparison-ours">{{ $section['data']['our_label'] ?? 'Our Product' }}</th>
                        <th class="comparison-theirs">{{ $section['data']['their_label'] ?? 'Others' }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($section['data']['rows'] as $row)
                    <tr>
                        <td class="comparison-feature">{{ $row['feature'] ?? '' }}</td>
                        <td class="comparison-ours-val">{{ $row['ours'] ?? '' }}</td>
                        <td class="comparison-theirs-val">{{ $row['theirs'] ?? '' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</section>
@endif
