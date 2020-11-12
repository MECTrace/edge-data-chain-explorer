from multiprocessing import get_logger

import mysql
import mysql.connector
from mysql.connector import Error

from builder import Builder
from collector import Collector


def create_db_connection(db_config):
    logger = get_logger()
    try:
        db = mysql.connector.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            database=db_config['database'],
        )
        logger.info("DB connected")
        return db
    except Error as e:
        logger.info("DB connection error {error}", error=e)
        raise


def collecting(args):
    logger = get_logger()
    db = create_db_connection(args.db_connection)

    collector = Collector(args.node, db)
    if args.rebuild:
        collector.clear()
    collector.stat()
    collector.play(args.limit)
    collector.stat()


def building(args):
    logger = get_logger()
    db = create_db_connection(args.db_connection)

    builder = Builder(args.chain, db)
    if args.rebuild:
        builder.clear()
    builder.stat()
    if not builder.play(args.limit):
        logger.debug("building fail")
        return
    builder.stat()
