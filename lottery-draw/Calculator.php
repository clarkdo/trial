<?php
date_default_timezone_set('Europe/Dublin');

if (php_sapi_name() == "cli") {
    try {
        $includePast = $argv[2];
        if (!$includePast || $includePast == "false") {
            $includePast = false;
        } else {
            $includePast = true;
        }
        $draw = Calculator::calculate($argv[1], $includePast);
        if ($draw instanceof DateTime) {
            echo "Next valid draw date is: {$draw->format('l,d F Y')}\n";
        }
    } catch (Exception $e) {
        echo "{$e->getMessage()}\n";
    }
}

class Calculator
{
    /**
     * Calculate next valid draw date: nearest Wednesday or Friday
     *
     * @param DateTime $date The date which calculation is based on
     * @param Boolean $includePast If return value includes the past date
     *
     * @throws Exception If parameter date is not a valid format
     * @author Clark Du <clark.duxin@gmail.com>
     * @return Datetime next valid draw date
     */
    public static function calculate($date = 'NOW', $includePast = false): DateTime
    {
        if (!($date instanceof DateTime)) {
            try {
                $date = new DateTime($date);
            } catch (Exception $e) {
                throw new Exception('Please input a valid date time.');
            }
        }

        // If $includePast is false and input time is earlier than current time, calculate from now
        if ($includePast == false) {
            $now = new DateTime('NOW');
            if ($date < $now) {
                $date = $now;
            }
        }

        $draw = (clone $date)->modify('wednesday 20:00 this week');
        if ($date > $draw) {
            $draw->modify('friday 20:00 this week');
            if ($date > $draw) {
                $draw = $date->modify('wednesday 20:00 next week');
            }
        }
        return $draw;
    }
}
