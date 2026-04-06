from playwright.sync_api import sync_playwright, expect

def test_charts():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to mfe1 directly as the shell config map might need updating to show the menus.
        page.goto("http://localhost:3000/bar-chart")

        # Wait for the chart to be visible
        expect(page.locator("app-bar-chart-show")).to_be_visible(timeout=10000)

        # Take a screenshot
        page.screenshot(path="bar_chart.png", full_page=True)

        page.goto("http://localhost:3000/scatter-plot")

        # Wait for the chart to be visible
        expect(page.locator("app-scatter-plot-show")).to_be_visible(timeout=10000)

        # Take a screenshot
        page.screenshot(path="scatter_plot.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    test_charts()
