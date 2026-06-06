<script lang="ts">
    export interface SpendingChartItem {
        label: string;
        value: number;
        color?: string;
    }

    interface Props {
        data: SpendingChartItem[];
    }

    const { data }: Props = $props();

    const max = $derived(Math.max(...data.map((d) => d.value), 1));
</script>

<article class="chart-card">
    <div class="chart" role="list" aria-label="Gráfico de gastos">
        {#each data as d (d.label)}
            {@const percent = Math.max((d.value / max) * 100, 2)}
            <div class="chart__column" role="listitem">
                <div class="chart__track">
                    <div
                        class="chart__bar"
                        style="height: {percent}%; background-color: {d.color ?? 'rgba(74,222,128,0.7)'};"
                        title="{d.label}: {d.value}"
                        aria-label="Gasto en {d.label}: {d.value}"
                    ></div>
                </div>
                <span class="chart__label" aria-hidden="true">{d.label}</span>
            </div>
        {/each}
    </div>
</article>

<style lang="scss">
    $font-mono: 'DM Mono', monospace;

    $color-bg-card: #181b1f;
    $color-border: #2a2e35;
    $color-text-label: #5a6170;

    .chart-card {
        border-radius: 0.5rem;
        border: 0.0625rem solid $color-border;
        background-color: $color-bg-card;
        padding: 1.5rem;
    }

    .chart {
        display: flex;
        align-items: flex-end;
        gap: 0.5rem;
        height: 7.5rem; 
    }

    .chart__column {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
    }

    .chart__track {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-end;
    }

    .chart__bar {
        width: 100%;
        min-height: 0.25rem;
        border-radius: 0.1875rem 0.1875rem 0 0;
        opacity: 0.8;
        transition: height 0.3s ease, opacity 0.2s ease;
        cursor: pointer;

        &:hover, &:focus-visible {
            opacity: 1;
            outline: none;
        }
    }

    .chart__label {
        font-family: $font-mono;
        font-size: 0.6rem;
        letter-spacing: 0.08em;
        color: $color-text-label;
        text-transform: uppercase;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }
</style>