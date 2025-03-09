import { Component } from "@angular/core";

@Component({
  selector: "app-default-dashboard",
  templateUrl: "./default-dashboard.component.html",
  styleUrls: ["./default-dashboard.component.scss"],
})
export class DefaultDashboardComponent {
  items: any;
  monthlyCollectionData: any;
  monthlyCollectionOptions: any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    this.monthlyCollectionData = {
      labels: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
      ],
      datasets: [
        {
          label: "",
          data: [
            10000, 10000, 10000, 1100, 2000, 25000, 0, 400, 1000, 2000, 5000,
            10000, 10000, 10000, 10000,
          ],
          fill: true,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
          backgroundColor: "rgba(38, 99, 255, 0.2)",
        },
      ],
    };

    this.monthlyCollectionOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          title: {
            display: true,
            text: "Days of the month",
            color: textColor,
            font: {
              size: 10,
            },
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          title: {
            display: true,
            text: "Revenue",
            color: textColor,
            font: {
              size: 10,
            },
          },
        },
      },
    };
  }
}
