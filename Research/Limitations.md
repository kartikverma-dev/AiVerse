# Limitations

## Cold Start Problem
Newly created terms have zero historical snapshots, making trend velocity calculations impossible for the first 14 days.

## Language Bias
The ingestion pipeline is currently optimized for English-only papers and repositories, neglecting developments published in other languages.

## API Limits
Rate limits on GitHub API and academic search endpoints throttle the speed of metric synchronization.