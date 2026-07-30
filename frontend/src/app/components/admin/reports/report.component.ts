import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  loading = signal(true);
  hasData = signal(false);

  // 1. Gráfico de Categorías (Dona)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
    }
  };
  public pieChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#003f5c', '#594e90', '#bc4c96', '#ff5f66', '#ffa600'] }]
  };

  // 2. Gráfico de Crecimiento de Usuarios (Líneas)
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ data: [], label: 'Nuevos Usuarios', borderColor: '#3A61FF', tension: 0.4, fill: true }]
  };

  // 3. Gráfico de Stock Crítico (Barras)
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Unidades', backgroundColor: '#efbcac' }]
  };

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllReports();
  }

  loadAllReports(): void {
    this.loading.set(true);

    // Usamos forkJoin o suscripciones encadenadas para asegurar que todo cargue
    this.reportService.getInventoryDistribution().subscribe({
      next: (data) => {
        console.log('Reportes: Datos de inventario recibidos', data);
        // FORZAR REDIBUJO: Creamos un nuevo objeto de referencia
        this.pieChartData = {
          labels: data.map(item => item.category || 'Sin Categoría'),
          datasets: [{
            data: data.map(item => item.count),
            backgroundColor: ['#003f5c', '#594e90', '#bc4c96', '#ff5f66', '#ffa600', '#62736b']
          }]
        };
        this.checkDataStatus();
      }
    });

    this.reportService.getUserGrowth().subscribe({
      next: (data) => {
        this.lineChartData = {
          labels: data.map(item => item.month),
          datasets: [{
            data: data.map(item => item.count),
            label: 'Nuevos Usuarios',
            borderColor: '#3A61FF',
            backgroundColor: 'rgba(58, 97, 255, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };
        this.checkDataStatus();
      }
    });

    this.reportService.getLowStockTop().subscribe({
      next: (data) => {
        this.barChartData = {
          labels: data.map(item => item.nombre),
          datasets: [{
            data: data.map(item => item.stock),
            label: 'Unidades en Almacén',
            backgroundColor: '#FF5F66'
          }]
        };
        this.loading.set(false);
        this.checkDataStatus();
      }
    });
  }

  private checkDataStatus(): void {
    this.hasData.set(true);
    this.cdr.detectChanges();
  }
}
