import time
import asyncio
from apscheduler.schedulers.blocking import BlockingScheduler
from data_pipeline import run_pipeline, logger

def scheduled_job():
    """Wrapper to run the async pipeline in a synchronous scheduler."""
    logger.info("Executing scheduled pipeline run...")
    asyncio.run(run_pipeline())

if __name__ == "__main__":
    scheduler = BlockingScheduler()
    
    # Run once immediately on start
    scheduled_job()
    
    # Step 7: Schedule job every 30 minutes
    scheduler.add_job(scheduled_job, 'interval', minutes=30)
    
    logger.info("Scheduler started. Pipeline will run every 30 minutes.")
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("Scheduler stopped.")
