export function stockHistoryMonthly() {
  const queries = `with stock_summary as (
select pv.name as variant_name, p.name as product_name, loc.address as store_address, 
DATE_FORMAT(sh.created_at, '%Y-%m-01') AS month, 
SUM(CASE WHEN sh.qty_change > 0 THEN sh.qty_change ELSE 0 END) AS total_additions,
SUM(CASE WHEN sh.qty_change < 0 THEN ABS(sh.qty_change) ELSE 0 END) AS total_subtractions,
SUM(CASE WHEN sh.qty_change > 0 THEN sh.qty_change ELSE 0 END) - SUM(CASE WHEN sh.qty_change < 0 THEN ABS(sh.qty_change) ELSE 0 END) AS final_qty
from stock_history sh
join store_stock ss on ss.id = sh.store_stock_id
join product_variants pv on ss.variant_id = pv.id
join products p on pv.product_id = p.id
join stores s on ss.store_id = s.address_id
join addresses loc on s.address_id = loc.id
group by p.name, pv.name, month, loc.id
) select sts.variant_name, sts.product_name, sts.store_address, sts.month, sts.total_additions, sts.total_subtractions, sts.final_qty
from stock_summary sts order by month;`;
  return queries;
}
