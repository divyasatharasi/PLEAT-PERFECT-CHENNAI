# Business Analytics Dashboard Generator
# Automatically generates business performance reports

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class PleatPerfectAnalytics:
    """
    Business Analytics Dashboard for Pleat Perfect Chennai
    Generates automated reports and insights
    """
    
    def __init__(self, data_source="google_sheets"):
        self.business_name = "Pleat Perfect Chennai"
        self.data_source = data_source
        self.current_date = datetime.now()
        
        # Business metrics configuration
        self.metrics_config = {
            "target_monthly_revenue": 50000,
            "target_monthly_customers": 100,
            "target_conversion_rate": 15,  # percentage
            "service_prices": {
                "basic": 250,
                "premium": 400,
                "bridal": 650
            }
        }
        
    def generate_daily_report(self):
        """Generate daily business performance report"""
        today = self.current_date.strftime("%Y-%m-%d")
        
        # Sample data structure - replace with actual data fetching
        daily_data = self.fetch_daily_data(today)
        
        report = {
            "date": today,
            "revenue": {
                "today": daily_data.get("revenue", 0),
                "target": self.metrics_config["target_monthly_revenue"] / 30,
                "achievement_percentage": 0
            },
            "customers": {
                "new_customers": daily_data.get("new_customers", 0),
                "repeat_customers": daily_data.get("repeat_customers", 0),
                "total_served": 0
            },
            "services": {
                "basic_pleating": daily_data.get("basic_services", 0),
                "premium_pleating": daily_data.get("premium_services", 0),
                "bridal_services": daily_data.get("bridal_services", 0)
            },
            "conversion": {
                "website_visitors": daily_data.get("website_visitors", 0),
                "inquiries": daily_data.get("inquiries", 0),
                "bookings": daily_data.get("bookings", 0),
                "conversion_rate": 0
            }
        }
        
        # Calculate derived metrics
        report["revenue"]["achievement_percentage"] = (
            report["revenue"]["today"] / report["revenue"]["target"] * 100
        )
        
        report["customers"]["total_served"] = (
            report["customers"]["new_customers"] + report["customers"]["repeat_customers"]
        )
        
        if report["conversion"]["inquiries"] > 0:
            report["conversion"]["conversion_rate"] = (
                report["conversion"]["bookings"] / report["conversion"]["inquiries"] * 100
            )
        
        return report
    
    def generate_weekly_report(self):
        """Generate weekly business analysis"""
        week_start = self.current_date - timedelta(days=7)
        week_data = self.fetch_week_data(week_start, self.current_date)
        
        weekly_summary = {
            "week_period": f"{week_start.strftime('%Y-%m-%d')} to {self.current_date.strftime('%Y-%m-%d')}",
            "total_revenue": sum(week_data.get("daily_revenue", [])),
            "total_customers": sum(week_data.get("daily_customers", [])),
            "service_breakdown": {
                "basic": sum(week_data.get("basic_services", [])),
                "premium": sum(week_data.get("premium_services", [])),
                "bridal": sum(week_data.get("bridal_services", []))
            },
            "peak_days": self.identify_peak_days(week_data),
            "customer_satisfaction": {
                "average_rating": week_data.get("average_rating", 0),
                "total_reviews": week_data.get("total_reviews", 0)
            }
        }
        
        return weekly_summary
    
    def generate_monthly_report(self):
        """Generate comprehensive monthly business report"""
        month_start = self.current_date.replace(day=1)
        month_data = self.fetch_month_data(month_start, self.current_date)
        
        monthly_report = {
            "month": self.current_date.strftime("%B %Y"),
            "revenue_analysis": {
                "total_revenue": month_data.get("total_revenue", 0),
                "target_revenue": self.metrics_config["target_monthly_revenue"],
                "achievement_rate": 0,
                "average_daily_revenue": 0
            },
            "customer_analysis": {
                "total_customers": month_data.get("total_customers", 0),
                "new_customers": month_data.get("new_customers", 0),
                "repeat_customers": month_data.get("repeat_customers", 0),
                "customer_retention_rate": 0
            },
            "service_performance": {
                "most_popular_service": self.get_most_popular_service(month_data),
                "service_revenue_breakdown": self.calculate_service_revenue(month_data)
            },
            "growth_metrics": {
                "month_over_month_growth": self.calculate_mom_growth(month_data),
                "customer_acquisition_cost": self.calculate_acquisition_cost(month_data)
            }
        }
        
        # Calculate derived metrics
        days_in_month = (self.current_date - month_start).days + 1
        monthly_report["revenue_analysis"]["average_daily_revenue"] = (
            monthly_report["revenue_analysis"]["total_revenue"] / days_in_month
        )
        
        monthly_report["revenue_analysis"]["achievement_rate"] = (
            monthly_report["revenue_analysis"]["total_revenue"] / 
            monthly_report["revenue_analysis"]["target_revenue"] * 100
        )
        
        return monthly_report
    
    def create_visual_dashboard(self, report_data):
        """Create visual charts for the dashboard"""
        plt.style.use('seaborn-v0_8')
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle(f'{self.business_name} - Business Dashboard', fontsize=16, fontweight='bold')
        
        # Revenue trend chart
        axes[0, 0].plot(report_data.get("revenue_trend", []), marker='o', color='#d63384')
        axes[0, 0].set_title('Daily Revenue Trend')
        axes[0, 0].set_ylabel('Revenue (₹)')
        axes[0, 0].grid(True, alpha=0.3)
        
        # Service distribution pie chart
        service_data = report_data.get("service_breakdown", {})
        if service_data:
            axes[0, 1].pie(service_data.values(), labels=service_data.keys(), 
                          autopct='%1.1f%%', colors=['#d63384', '#6f42c1', '#fd7e14'])
            axes[0, 1].set_title('Service Distribution')
        
        # Customer acquisition chart
        customer_data = report_data.get("customer_trend", [])
        if customer_data:
            axes[1, 0].bar(range(len(customer_data)), customer_data, color='#6f42c1')
            axes[1, 0].set_title('Daily Customer Count')
            axes[1, 0].set_ylabel('Customers')
        
        # Conversion funnel
        funnel_data = report_data.get("conversion_funnel", {})
        if funnel_data:
            stages = list(funnel_data.keys())
            values = list(funnel_data.values())
            axes[1, 1].barh(stages, values, color=['#28a745', '#ffc107', '#d63384'])
            axes[1, 1].set_title('Conversion Funnel')
            axes[1, 1].set_xlabel('Count')
        
        plt.tight_layout()
        return fig
    
    def generate_whatsapp_report(self, report_type="daily"):
        """Generate formatted report for WhatsApp sharing"""
        if report_type == "daily":
            report = self.generate_daily_report()
            message = f"""📊 *Daily Report - {self.business_name}*
📅 Date: {report['date']}

💰 *Revenue*
Today: ₹{report['revenue']['today']:,}
Target: ₹{report['revenue']['target']:,.0f}
Achievement: {report['revenue']['achievement_percentage']:.1f}%

👥 *Customers*
New: {report['customers']['new_customers']}
Repeat: {report['customers']['repeat_customers']}
Total: {report['customers']['total_served']}

🛍️ *Services*
Basic: {report['services']['basic_pleating']}
Premium: {report['services']['premium_pleating']}
Bridal: {report['services']['bridal_services']}

📈 *Conversion*
Inquiries: {report['conversion']['inquiries']}
Bookings: {report['conversion']['bookings']}
Rate: {report['conversion']['conversion_rate']:.1f}%

Keep up the great work! 🌸"""
        
        elif report_type == "weekly":
            report = self.generate_weekly_report()
            message = f"""📊 *Weekly Report - {self.business_name}*
📅 Period: {report['week_period']}

💰 Total Revenue: ₹{report['total_revenue']:,}
👥 Total Customers: {report['total_customers']}

🛍️ *Service Breakdown*
Basic: {report['service_breakdown']['basic']}
Premium: {report['service_breakdown']['premium']}
Bridal: {report['service_breakdown']['bridal']}

⭐ Customer Rating: {report['customer_satisfaction']['average_rating']:.1f}/5
📝 Total Reviews: {report['customer_satisfaction']['total_reviews']}

Excellent week! 🎉"""
        
        return message
    
    def send_automated_email_report(self, email_recipient, report_type="daily"):
        """Send automated email reports"""
        report = None
        subject = ""
        
        if report_type == "daily":
            report = self.generate_daily_report()
            subject = f"Daily Business Report - {report['date']}"
        elif report_type == "weekly":
            report = self.generate_weekly_report()
            subject = f"Weekly Business Report - {self.business_name}"
        elif report_type == "monthly":
            report = self.generate_monthly_report()
            subject = f"Monthly Business Report - {report['month']}"
        
        # Create HTML email content
        html_content = self.create_html_report(report, report_type)
        
        # Email configuration (you'll need to set up your email credentials)
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = "reports@pleatperfectchennai.com"
        msg['To'] = email_recipient
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Note: Configure SMTP settings for your email provider
        return msg
    
    def create_html_report(self, report_data, report_type):
        """Create HTML formatted report"""
        html_template = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                .header {{ background: linear-gradient(135deg, #d63384, #6f42c1); color: white; padding: 20px; text-align: center; }}
                .metric {{ background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; }}
                .positive {{ color: #28a745; font-weight: bold; }}
                .negative {{ color: #dc3545; font-weight: bold; }}
                .neutral {{ color: #6c757d; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{self.business_name}</h1>
                <h2>{report_type.title()} Business Report</h2>
            </div>
            
            <!-- Report content will be dynamically generated based on report_data -->
            <div class="content">
                {self.format_report_content(report_data, report_type)}
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #e9ecef; text-align: center;">
                <p>Generated automatically by Pleat Perfect Chennai Business Analytics System</p>
                <p>Report generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
        </body>
        </html>
        """
        
        return html_template
    
    def format_report_content(self, report_data, report_type):
        """Format report data into HTML"""
        if report_type == "daily":
            return f"""
            <div class="metric">
                <h3>Revenue Performance</h3>
                <p>Today's Revenue: ₹{report_data['revenue']['today']:,}</p>
                <p>Target: ₹{report_data['revenue']['target']:,.0f}</p>
                <p class="{'positive' if report_data['revenue']['achievement_percentage'] >= 100 else 'neutral'}">
                    Achievement: {report_data['revenue']['achievement_percentage']:.1f}%
                </p>
            </div>
            
            <div class="metric">
                <h3>Customer Metrics</h3>
                <p>New Customers: {report_data['customers']['new_customers']}</p>
                <p>Repeat Customers: {report_data['customers']['repeat_customers']}</p>
                <p>Total Served: {report_data['customers']['total_served']}</p>
            </div>
            """
        
        # Add more formatting for other report types
        return "<p>Report content formatting in progress...</p>"
    
    def schedule_automated_reports(self):
        """Set up automated report scheduling"""
        schedule_config = {
            "daily_report": {
                "time": "20:00",  # 8 PM daily
                "recipients": ["owner@pleatperfectchennai.com"],
                "whatsapp": True
            },
            "weekly_report": {
                "day": "Sunday",
                "time": "10:00",  # 10 AM Sunday
                "recipients": ["owner@pleatperfectchennai.com"],
                "whatsapp": True
            },
            "monthly_report": {
                "day": 1,  # 1st of each month
                "time": "09:00",  # 9 AM
                "recipients": ["owner@pleatperfectchennai.com", "accountant@pleatperfectchennai.com"]
            }
        }
        
        return schedule_config
    
    # Helper methods for data fetching (replace with actual data source integration)
    def fetch_daily_data(self, date):
        """Fetch daily business data from your data source"""
        # This should connect to your actual data source (Google Sheets, database, etc.)
        # For now, returning sample data structure
        return {
            "revenue": 1250,
            "new_customers": 3,
            "repeat_customers": 2,
            "basic_services": 2,
            "premium_services": 2,
            "bridal_services": 1,
            "website_visitors": 45,
            "inquiries": 8,
            "bookings": 5
        }
    
    def fetch_week_data(self, start_date, end_date):
        """Fetch weekly business data"""
        return {
            "daily_revenue": [1250, 980, 1400, 1100, 1800, 2200, 890],
            "daily_customers": [5, 4, 6, 4, 8, 9, 3],
            "basic_services": [2, 1, 3, 2, 3, 4, 1],
            "premium_services": [2, 2, 2, 1, 4, 4, 2],
            "bridal_services": [1, 1, 1, 1, 1, 1, 0],
            "average_rating": 4.8,
            "total_reviews": 12
        }
    
    def fetch_month_data(self, start_date, end_date):
        """Fetch monthly business data"""
        return {
            "total_revenue": 35000,
            "total_customers": 140,
            "new_customers": 45,
            "repeat_customers": 95
        }

# Usage example
if __name__ == "__main__":
    analytics = PleatPerfectAnalytics()
    
    # Generate daily report
    daily_report = analytics.generate_daily_report()
    print("Daily Report Generated:", daily_report)
    
    # Generate WhatsApp summary
    whatsapp_summary = analytics.generate_whatsapp_report("daily")
    print("\nWhatsApp Summary:")
    print(whatsapp_summary)
    
    # Generate weekly report
    weekly_report = analytics.generate_weekly_report()
    print("\nWeekly Report Generated:", weekly_report)