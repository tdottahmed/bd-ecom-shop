@if(!empty($section['data']['rows']))
<section class="lp-section bg-white">
    <div class="lp-container section-center">
        <div data-gsap="fade-up">
            <span class="section-label">Specifications</span>
            <h2 class="section-title" data-split="words">{{ $section['data']['title'] ?? '' }}</h2>
        </div>
        <div class="specs-wrap" data-gsap="fade-up" data-delay="0.12">
            <table class="specs-table">
                @foreach($section['data']['rows'] as $row)
                <tr>
                    <td>{{ $row['label'] ?? '' }}</td>
                    <td>{{ $row['value'] ?? '' }}</td>
                </tr>
                @endforeach
            </table>
        </div>
    </div>
</section>
@endif
