import { DatePipe, DecimalPipe } from "@angular/common";
import { Component } from "@angular/core";
import { firstValueFrom, forkJoin } from "rxjs";
import { DashboardService } from "src/app/shared/services/api-services/dashboard.service";
import { AppMessageService } from "src/app/shared/services/app-message.service";

@Component({
  selector: "app-default-dashboard",
  templateUrl: "./default-dashboard.component.html",
  styleUrls: ["./default-dashboard.component.scss"],
})
export class DefaultDashboardComponent {
  items: any;
  monthlyCollectionData: any;
  monthlyCollectionOptions: any;
  dashBoardStatistic: any;

  constructor(
    private messageService: AppMessageService,
    private dashboardService: DashboardService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe
  ) {}
  ngOnInit(): void {
    this.loadInitialData();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    this.monthlyCollectionOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false,
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
            text: "Days of the Month",
            color: textColor,
            font: {
              size: 12,
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
              size: 12,
            },
          },
        },
      },
    };
  }

  async loadInitialData() {
    try {
      const documentStyle = getComputedStyle(document.documentElement);

      const [statisticResult, collectionSummaryResult] = await firstValueFrom(
        forkJoin([
          this.dashboardService.GetDashboardStatistic(),
          this.dashboardService.GetCollectionSummary(),
        ])
      );

      if (statisticResult.IsSuccessful) {
        this.dashBoardStatistic = statisticResult.Result;
      }

      if (collectionSummaryResult.IsSuccessful) {
        let labels: string[] = [];
        let data: number[] = [];

        collectionSummaryResult.Result.forEach((element: any) => {
          labels.push(this.datePipe.transform(element.date, "dd"));
          data.push(element.collectionAmount);
        });

        this.monthlyCollectionData = {
          labels: labels,
          datasets: [
            {
              label: "",
              data: data,
              fill: true,
              borderColor: documentStyle.getPropertyValue("--blue-500"),
              tension: 0.4,
              backgroundColor: "rgba(38, 99, 255, 0.2)",
            },
          ],
        };
      }
    } catch (error: any) {
      this.messageService.showErrorAlert(error?.message || error);
    }
  }
}
